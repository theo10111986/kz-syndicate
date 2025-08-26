-- AlterTable
ALTER TABLE `PriceRequest` MODIFY `imageUrl` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `SavedDesign` MODIFY `imageUrl` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `VerificationToken` ADD PRIMARY KEY (`identifier`, `token`);

-- DropIndex
DROP INDEX `VerificationToken_identifier_token_key` ON `VerificationToken`;
