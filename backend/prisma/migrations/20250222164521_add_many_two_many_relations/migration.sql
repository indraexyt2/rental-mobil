/*
  Warnings:

  - You are about to drop the column `car_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `Features` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Features" DROP CONSTRAINT "Features_car_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_car_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "car_id",
DROP COLUMN "category",
ADD COLUMN     "category_name" VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE "Features";

-- CreateTable
CREATE TABLE "CategoryOnCars" (
    "car_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "CategoryOnCars_pkey" PRIMARY KEY ("car_id","category_id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" SERIAL NOT NULL,
    "feature" TEXT NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureOnCars" (
    "car_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "FeatureOnCars_pkey" PRIMARY KEY ("car_id","feature_id")
);

-- AddForeignKey
ALTER TABLE "CategoryOnCars" ADD CONSTRAINT "CategoryOnCars_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnCars" ADD CONSTRAINT "CategoryOnCars_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureOnCars" ADD CONSTRAINT "FeatureOnCars_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureOnCars" ADD CONSTRAINT "FeatureOnCars_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
