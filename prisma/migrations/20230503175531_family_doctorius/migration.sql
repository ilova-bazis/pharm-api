-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "family_doctor_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_family_doctor_id_fkey" FOREIGN KEY ("family_doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
