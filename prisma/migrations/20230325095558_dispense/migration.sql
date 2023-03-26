/*
  Warnings:

  - You are about to drop the column `dispence` on the `perscription_items` table. All the data in the column will be lost.
  - Added the required column `dispense` to the `perscription_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perscription_items" DROP COLUMN "dispence",
ADD COLUMN     "dispense" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "patient_id" INTEGER NOT NULL;
