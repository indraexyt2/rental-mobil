-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('INITIAL', 'ADDITIONAL', 'REFUND');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "payment_type" "PaymentType" NOT NULL DEFAULT 'INITIAL';
