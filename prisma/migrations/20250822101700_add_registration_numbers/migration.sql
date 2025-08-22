/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `registrationNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_registrationNumber_key` ON `User`(`registrationNumber`);
