-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'CREATOR');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPENED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('PROFILE', 'CODE', 'POST');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('INAPPROPRIATE_CONTENT', 'SPAM', 'HARASSMENT', 'HATE_SPEECH', 'MISINFORMATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CodeLanguage" AS ENUM ('HTML', 'CSS', 'JS', 'C', 'LISP');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastTimeLoggedIn" TIMESTAMP(3),
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "roles" "Role"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" BIGSERIAL NOT NULL,
    "fullname" VARCHAR(64),
    "avatarUrl" TEXT,
    "bio" VARCHAR(256) NOT NULL DEFAULT '',
    "location" VARCHAR(64),
    "workplace" VARCHAR(64),
    "education" VARCHAR(64),
    "websiteUrl" VARCHAR(64),
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerficationCode" (
    "id" BIGSERIAL NOT NULL,
    "code" CHAR(6) NOT NULL,
    "userId" BIGINT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresInMinutes" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "VerficationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IPAddressRecord" (
    "ip" TEXT NOT NULL,
    "lastTimeUsed" TIMESTAMP(3),
    "userId" BIGINT NOT NULL,

    CONSTRAINT "IPAddressRecord_pkey" PRIMARY KEY ("ip","userId")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "url" TEXT NOT NULL,
    "profileId" BIGINT NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("url","profileId")
);

-- CreateTable
CREATE TABLE "UserFollows" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" BIGINT NOT NULL,
    "followingId" BIGINT NOT NULL,

    CONSTRAINT "UserFollows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "UserBlocks" (
    "blockedById" BIGINT NOT NULL,
    "blockingId" BIGINT NOT NULL,

    CONSTRAINT "UserBlocks_pkey" PRIMARY KEY ("blockedById","blockingId")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" VARCHAR(256),
    "parentId" BIGINT,
    "authorId" BIGINT,
    "reportedUserId" BIGINT NOT NULL,
    "type" "ReportType" NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "assigneeId" BIGINT,
    "note" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" BIGSERIAL NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "banStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banEnd" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,
    "authorId" BIGINT,
    "relatedReportId" BIGINT,
    "note" TEXT,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Code" (
    "id" BIGSERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "source" VARCHAR NOT NULL,
    "title" VARCHAR(64) NOT NULL,
    "codeLanguage" "CodeLanguage" NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeVersion" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(64) NOT NULL,
    "source" TEXT NOT NULL,
    "codeId" BIGINT NOT NULL,

    CONSTRAINT "CodeVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeTemplate" (
    "id" BIGSERIAL NOT NULL,
    "language" "CodeLanguage" NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "CodeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" VARCHAR(64) NOT NULL,
    "authorId" BIGINT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_CodeToTag" (
    "A" BIGINT NOT NULL,
    "B" VARCHAR(64) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Code_uid_key" ON "Code"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "CodeTemplate_language_key" ON "CodeTemplate"("language");

-- CreateIndex
CREATE UNIQUE INDEX "_CodeToTag_AB_unique" ON "_CodeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CodeToTag_B_index" ON "_CodeToTag"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerficationCode" ADD CONSTRAINT "VerficationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IPAddressRecord" ADD CONSTRAINT "IPAddressRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollows" ADD CONSTRAINT "UserFollows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockingId_fkey" FOREIGN KEY ("blockingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_relatedReportId_fkey" FOREIGN KEY ("relatedReportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeVersion" ADD CONSTRAINT "CodeVersion_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodeToTag" ADD CONSTRAINT "_CodeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Code"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodeToTag" ADD CONSTRAINT "_CodeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
