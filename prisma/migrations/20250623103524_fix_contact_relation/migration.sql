/*
  Warnings:

  - You are about to drop the column `last_message_id` on the `contacts` table. All the data in the column will be lost.
  - You are about to alter the column `is_read` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_relation_id_fkey`;

-- DropIndex
DROP INDEX `messages_relation_id_fkey` ON `messages`;

-- AlterTable
ALTER TABLE `contacts` DROP COLUMN `last_message_id`,
    MODIFY `relation_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `messages` MODIFY `relation_id` INTEGER NULL,
    MODIFY `is_read` BOOLEAN NULL DEFAULT false,
    ALTER COLUMN `update_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `relations` ADD COLUMN `last_message_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_relation_id_fkey` FOREIGN KEY (`relation_id`) REFERENCES `relations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relations` ADD CONSTRAINT `relations_last_message_id_fkey` FOREIGN KEY (`last_message_id`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_relation_id_fkey` FOREIGN KEY (`relation_id`) REFERENCES `relations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
