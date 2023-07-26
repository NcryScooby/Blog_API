/*
  Warnings:

  - You are about to drop the column `tag` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "tag",
ADD COLUMN     "tags" TEXT[];
