/*
  Warnings:

  - Made the column `authentication_type` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `users_roles` DROP FOREIGN KEY `FK2o0jvgh89lemvvo17cbqvdxaa`;

-- AlterTable
ALTER TABLE `users` MODIFY `authentication_type` ENUM('DATABASE', 'GOOGLE', 'FACEBOOK', 'GITHUB') NOT NULL DEFAULT 'DATABASE',
    MODIFY `email` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
