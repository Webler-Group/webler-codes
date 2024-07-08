/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `websiteUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workplace` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "IPAddressRecord" DROP CONSTRAINT "IPAddressRecord_userId_fkey";

-- DropForeignKey
ALTER TABLE "SocialAccount" DROP CONSTRAINT "SocialAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBlocks" DROP CONSTRAINT "UserBlocks_blockedById_fkey";

-- DropForeignKey
ALTER TABLE "UserBlocks" DROP CONSTRAINT "UserBlocks_blockingId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollows" DROP CONSTRAINT "UserFollows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollows" DROP CONSTRAINT "UserFollows_followingId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "bio",
DROP COLUMN "education",
DROP COLUMN "fullname",
DROP COLUMN "location",
DROP COLUMN "websiteUrl",
DROP COLUMN "workplace";

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(64),
    "avatarUrl" TEXT,
    "bio" VARCHAR(256) NOT NULL DEFAULT '',
    "location" VARCHAR(64),
    "workplace" VARCHAR(64),
    "education" VARCHAR(64),
    "websiteUrl" VARCHAR(64),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IPAddressRecord" ADD CONSTRAINT "IPAddressRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockingId_fkey" FOREIGN KEY ("blockingId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
