/*
  Warnings:

  - You are about to drop the column `like` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `view` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "like",
DROP COLUMN "view";

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
