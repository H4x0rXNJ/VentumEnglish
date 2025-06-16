-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lesson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `lesson_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `UKofx66keruapi6vyqpv6f2or37`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `account_non_locked` BIT(1) NOT NULL,
    `address` VARCHAR(70) NULL,
    `authentication_type` ENUM('DATABASE', 'GOOGLE', 'FACEBOOK') NOT NULL DEFAULT 'DATABASE',
    `created_on` DATETIME(6) NULL,
    `email` VARCHAR(255) NOT NULL,
    `enabled` BIT(1) NOT NULL,
    `failed_attempt` INTEGER NOT NULL,
    `last_otp_send` DATETIME(6) NULL,
    `lock_time` DATETIME(6) NULL,
    `name` VARCHAR(255) NOT NULL,
    `otp` VARCHAR(64) NULL,
    `otp_expiry_date` DATETIME(6) NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(10) NULL,
    `photos` VARCHAR(64) NULL,
    `reset_password_token` VARCHAR(128) NULL,
    `reset_password_token_expiration_time` DATETIME(6) NULL,
    `reset_password_requested_at` DATETIME(6) NULL,
    `updated_on` DATETIME(6) NULL,
    `verification_code` VARCHAR(128) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,

    INDEX `FKj6m8fwv7oqv74fcehir1a9ffy`(`role_id`),
    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lesson` ADD CONSTRAINT `lesson_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `FKj6m8fwv7oqv74fcehir1a9ffy` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
