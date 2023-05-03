/*
  Warnings:

  - You are about to drop the column `family_doctor_id` on the `patients` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_family_doctor_id_fkey";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "family_doctor_id",
ADD COLUMN     "family_doctor" TEXT NOT NULL DEFAULT '';
