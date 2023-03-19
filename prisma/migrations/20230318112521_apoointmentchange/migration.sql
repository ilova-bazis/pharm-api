/*
  Warnings:

  - You are about to drop the column `dob` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `middle_name` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `middle_name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `national_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `patients` table. All the data in the column will be lost.
  - Added the required column `end_at` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('PHARMACY', 'CLINIC', 'POLYCLINIC', 'HOSPITAL', 'LABORATORY', 'DIAGNOSTIC_CENTER', 'DENTAL_CLINIC');

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_address_id_fkey";

-- DropIndex
DROP INDEX "patients_national_id_key";

-- DropIndex
DROP INDEX "patients_tax_id_key";

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "end_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "dob",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "middle_name",
DROP COLUMN "sex";

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "type" "LocationType" NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "address_id",
DROP COLUMN "dob",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "middle_name",
DROP COLUMN "national_id",
DROP COLUMN "sex",
DROP COLUMN "tax_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "admin_id" INTEGER,
ADD COLUMN     "person_id" INTEGER;

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "middle_name" TEXT,
    "sex" "Sex" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "national_id" TEXT,
    "tax_id" TEXT,
    "address_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_national_id_key" ON "persons"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "persons_tax_id_key" ON "persons"("tax_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
