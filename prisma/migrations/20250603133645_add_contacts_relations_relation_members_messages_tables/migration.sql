-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(120) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `target_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `relation_id` INTEGER NOT NULL,
    `last_message_id` INTEGER NOT NULL,
    `total_unread_message` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `contacts_target_id_owner_id_key`(`target_id`, `owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('PRIVATE', 'GROUP') NOT NULL DEFAULT 'PRIVATE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relation_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `relation_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_id` INTEGER NOT NULL,
    `content` LONGTEXT NOT NULL,
    `relation_id` INTEGER NOT NULL,
    `is_read` INTEGER NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),


    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_target_id_fkey` FOREIGN KEY (`target_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relation_members` ADD CONSTRAINT `relation_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relation_members` ADD CONSTRAINT `relation_members_relation_id_fkey` FOREIGN KEY (`relation_id`) REFERENCES `relations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_relation_id_fkey` FOREIGN KEY (`relation_id`) REFERENCES `relations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
