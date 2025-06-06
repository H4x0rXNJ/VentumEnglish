/*
  Warnings:

  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Invoice`;

-- CreateTable
CREATE TABLE `invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice` VARCHAR(191) NULL,
    `payment_status` VARCHAR(191) NULL,
    `payment_method` VARCHAR(191) NULL,
    `total_amount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
