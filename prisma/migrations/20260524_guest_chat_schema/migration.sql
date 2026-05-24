-- Clear old chat data (incompatible with guest chat schema)
TRUNCATE TABLE "Message" CASCADE;
TRUNCATE TABLE "ChatRoom" CASCADE;

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT IF EXISTS "ChatRoom_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_senderId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "ChatRoom_customerId_key";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN IF EXISTS "customerId",
ADD COLUMN IF NOT EXISTS "guestId" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "guestName" TEXT NOT NULL DEFAULT 'Guest';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "guestId" TEXT,
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "senderId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ChatRoom_guestId_key" ON "ChatRoom"("guestId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
