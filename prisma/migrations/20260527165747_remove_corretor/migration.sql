/*
  Warnings:

  - The values [CORRETOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `brokerId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CLIENTE', 'PROPRIETARIO');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_B_fkey";

-- DropIndex
DROP INDEX "Property_brokerId_idx";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "brokerId",
DROP COLUMN "isFeatured",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "photo",
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
ALTER COLUMN "phone" DROP NOT NULL;

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "_UserFavorites";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- DropEnum
DROP TYPE "LeadStatus";
