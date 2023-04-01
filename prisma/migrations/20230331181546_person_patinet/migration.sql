/*
  Warnings:

  - A unique constraint covering the columns `[patient_id]` on the table `persons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patient_id` to the `persons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "patient_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "persons_patient_id_key" ON "persons"("patient_id");

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
