/*
  Warnings:

  - Made the column `lang_native` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `lang_native` VARCHAR(191) NOT NULL;
