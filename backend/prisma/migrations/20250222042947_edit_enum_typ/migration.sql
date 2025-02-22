/*
  Warnings:

  - The values [BENSIN,SOLAR,LISTRIK] on the enum `FuelType` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANUAL,AUTOMATIC] on the enum `TransType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FuelType_new" AS ENUM ('Bensin', 'Solar', 'Listrik');
ALTER TABLE "cars" ALTER COLUMN "fuel_type" TYPE "FuelType_new" USING ("fuel_type"::text::"FuelType_new");
ALTER TYPE "FuelType" RENAME TO "FuelType_old";
ALTER TYPE "FuelType_new" RENAME TO "FuelType";
DROP TYPE "FuelType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransType_new" AS ENUM ('Manual', 'Automatic');
ALTER TABLE "cars" ALTER COLUMN "transmission" TYPE "TransType_new" USING ("transmission"::text::"TransType_new");
ALTER TYPE "TransType" RENAME TO "TransType_old";
ALTER TYPE "TransType_new" RENAME TO "TransType";
DROP TYPE "TransType_old";
COMMIT;
