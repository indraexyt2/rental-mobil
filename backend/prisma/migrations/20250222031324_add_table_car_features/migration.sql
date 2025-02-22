/*
  Warnings:

  - You are about to drop the column `features` on the `cars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "features";

-- CreateTable
CREATE TABLE "Features" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "feature" TEXT NOT NULL,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
