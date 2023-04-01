/*
  Warnings:

  - You are about to drop the column `sogned_at` on the `prescriptions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('PENDING', 'SIGNED', 'DISPENSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "sogned_at",
ADD COLUMN     "signed_at" TIMESTAMP(3);
