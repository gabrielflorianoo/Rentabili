/*
  Warnings:

  - You are about to alter the column `value` on the `historicalbalance` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `type` to the `Active` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `active` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `historicalbalance` MODIFY `value` DECIMAL(10, 2) NOT NULL;

-- RedefineIndex
CREATE INDEX `Active_userId_idx` ON `Active`(`userId`);
DROP INDEX `Active_userId_fkey` ON `active`;
