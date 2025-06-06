-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice` VARCHAR(191) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `content` LONGTEXT NULL,
    `created_on` DATETIME(6) NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `updated_on` DATETIME(6) NULL,
    `votes` INTEGER NOT NULL,
    `post_id` BIGINT NOT NULL,

    INDEX `FKh4c7lvsc298whoyd4w9ta25cr`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `booking_date` DATETIME(6) NULL,
    `checkin_date` DATETIME(6) NULL,
    `checkout_date` DATETIME(6) NULL,
    `name` VARCHAR(100) NULL,
    `photos` VARCHAR(64) NULL,
    `room_id` VARCHAR(20) NULL,
    `status` ENUM('ALL', 'BOOKED', 'CANCELLED', 'PENDING') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `content` TINYTEXT NOT NULL,
    `created_on` DATETIME(6) NOT NULL,
    `photos` VARCHAR(255) NULL,
    `short_description` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `updated_on` DATETIME(6) NULL,
    `url` VARCHAR(255) NULL,
    `created_by` BIGINT NOT NULL,

    INDEX `FK4s8wtgwpo1h8p5tsy9f04ybjg`(`created_by`),
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
    `authentication_type` ENUM('DATABASE', 'FACEBOOK', 'GOOGLE') NULL,
    `created_on` DATETIME(6) NULL,
    `email` VARCHAR(255) NULL,
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
    `updated_on` DATETIME(6) NULL,
    `verification_code` VARCHAR(128) NULL,

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
ALTER TABLE `comments` ADD CONSTRAINT `FKh4c7lvsc298whoyd4w9ta25cr` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `FK4s8wtgwpo1h8p5tsy9f04ybjg` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `FKj6m8fwv7oqv74fcehir1a9ffy` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
