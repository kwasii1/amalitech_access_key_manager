/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `password_reset_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `password_reset_tokens` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users` MODIFY `email_verified_at` TIMESTAMP(0) NULL;

-- CreateTable
CREATE TABLE `sessions` (
    `session_id` VARCHAR(128) NOT NULL,
    `expires` INTEGER UNSIGNED NOT NULL,
    `data` MEDIUMTEXT NULL,

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_keys` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `date_of_procurement` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiry_date` DATETIME(3) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `access_keys_key_key`(`key`),
    INDEX `access_keys_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `access_key_id` VARCHAR(255) NOT NULL,
    `payment_method` VARCHAR(255) NOT NULL,
    `plan` VARCHAR(255) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `mobile_number` VARCHAR(255) NULL,
    `status` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Payment_access_key_id_key`(`access_key_id`),
    INDEX `Payment_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `password_reset_tokens_token_key` ON `password_reset_tokens`(`token`);

-- AddForeignKey
ALTER TABLE `access_keys` ADD CONSTRAINT `access_keys_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `Payment_access_key_id_fkey` FOREIGN KEY (`access_key_id`) REFERENCES `access_keys`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `Payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
