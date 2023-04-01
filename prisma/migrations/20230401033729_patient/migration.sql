-- DropForeignKey
ALTER TABLE "persons" DROP CONSTRAINT "persons_patient_id_fkey";

-- AlterTable
ALTER TABLE "persons" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "patient_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
