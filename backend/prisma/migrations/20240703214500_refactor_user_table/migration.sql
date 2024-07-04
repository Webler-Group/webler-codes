/*
  Warnings:

  - You are about to drop the `_UserBlocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserBlocks" DROP CONSTRAINT "_UserBlocks_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBlocks" DROP CONSTRAINT "_UserBlocks_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollows" DROP CONSTRAINT "_UserFollows_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollows" DROP CONSTRAINT "_UserFollows_B_fkey";

-- DropTable
DROP TABLE "_UserBlocks";

-- DropTable
DROP TABLE "_UserFollows";

-- CreateTable
CREATE TABLE "UserFollows" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "UserFollows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "UserBlocks" (
    "blockedById" INTEGER NOT NULL,
    "blockingId" INTEGER NOT NULL,

    CONSTRAINT "UserBlocks_pkey" PRIMARY KEY ("blockedById","blockingId")
);

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockingId_fkey" FOREIGN KEY ("blockingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
