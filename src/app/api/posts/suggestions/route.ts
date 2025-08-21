// src/app/api/posts/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, clubName } = body;

    if (!topic || !clubName) {
      return new NextResponse('Missing required fields: topic and clubName', { status: 400 });
    }

    const prompt = `
      As an expert in student engagement and social media, generate 3 distinct post ideas for a university club.
      The club is called "${clubName}".
      The topic for the posts is: "${topic}".

      For each idea, provide a catchy title and a short paragraph of content (2-4 sentences).
      The tone should be enthusiastic, friendly, and engaging for a student audience.
      Format the output as a JSON array of objects, where each object has a "title" and "content" key.
      Do not include any other text or explanations outside of the JSON array.
      Example format:
      [
        {
          "title": "Example Title 1",
          "content": "This is the example content for the first post idea."
        },
        {
          "title": "Example Title 2",
          "content": "This is the example content for the second post idea."
        }
      ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const suggestions = response.choices[0].message?.content;

    if (!suggestions) {
      return new NextResponse('Failed to generate suggestions from AI', { status: 500 });
    }

    // The model should return a JSON string, so we parse it before sending.
    return NextResponse.json(JSON.parse(suggestions));

  } catch (error) {
    console.error('AI Post Suggestion Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
