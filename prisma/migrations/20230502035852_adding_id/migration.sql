/*
  Warnings:

  - The primary key for the `pharmacy_location_map` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `notes` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pharmacy_location_map" DROP CONSTRAINT "pharmacy_location_map_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "pharmacy_location_map_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "notes" TEXT NOT NULL;
