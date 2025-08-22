"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { DEFAULT_IMAGES, getDefaultImage } from "@/lib/constants";

interface ImageUploadProps {
  type: 'logo' | 'banner';
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  label: string;
  description?: string;
  className?: string;
}

export function ImageUpload({ 
  type, 
  currentUrl, 
  onUploadComplete, 
  label, 
  description,
  className = "" 
}: ImageUploadProps) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      // Update the form with the new URL
      onUploadComplete(result.url);
      
      toast({
        title: "Upload Successful",
        description: `${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`,
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      // Remove preview if upload failed
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        uploadFile(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor={`${type}-upload`}>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Current Image Display */}
      {currentUrl && !previewUrl && (
        <div className="relative inline-block">
          <img 
            src={currentUrl} 
            alt={`Current ${type}`}
            className="max-w-[200px] max-h-[200px] object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Default Image Display (when no current image) */}
      {!currentUrl && !previewUrl && (
        <div className="relative inline-block">
          <img 
            src={type === 'logo' ? DEFAULT_IMAGES.CLUB_LOGO : DEFAULT_IMAGES.CLUB_BANNER}
            alt={`Default ${type}`}
            className="max-w-[200px] max-h-[200px] object-cover rounded-lg border opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
              Default {type}
            </span>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <img 
            src={previewUrl} 
            alt={`${type} preview`}
            className="max-w-[200px] max-h-[200px] object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-gray-400 ${
          isUploading ? 'border-blue-400 bg-blue-50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-sm text-blue-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
            <div className="text-sm text-gray-600">
              <p className="font-medium">Drop an image here, or click to select</p>
              <p className="text-xs mt-1">Supports: JPEG, PNG, GIF (Max: 5MB)</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        id={`${type}-upload`}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
