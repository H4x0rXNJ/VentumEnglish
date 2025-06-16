-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `audioUrl` VARCHAR(191) NULL,
    ADD COLUMN `duration` DOUBLE NULL,
    ADD COLUMN `transcriptJsonPath` VARCHAR(191) NULL;
