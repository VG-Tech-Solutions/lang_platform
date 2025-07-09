-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lang_native` VARCHAR(191) NOT NULL,
    `is_premium` BOOLEAN NOT NULL DEFAULT false,
    `stripe_customer_id` VARCHAR(191) NULL,
    `subscription_status` VARCHAR(191) NULL,
    `subscription_renewal` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LangNative` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang_code` VARCHAR(191) NOT NULL,
    `lang_name` VARCHAR(191) NOT NULL,
    `native_title` VARCHAR(191) NOT NULL,
    `lang_flag` VARCHAR(191) NOT NULL,
    `native_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LangLearn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang_code` VARCHAR(191) NOT NULL,
    `learn_code` VARCHAR(191) NOT NULL,
    `learn_title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `en` VARCHAR(191) NOT NULL,
    `pt` VARCHAR(191) NOT NULL,
    `es` VARCHAR(191) NOT NULL,
    `fr` VARCHAR(191) NOT NULL,
    `de` VARCHAR(191) NOT NULL,
    `it` VARCHAR(191) NOT NULL,
    `ru` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Translation_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lesson_title` VARCHAR(191) NOT NULL,
    `lesson_order` INTEGER NOT NULL,
    `lesson_access` VARCHAR(191) NOT NULL,
    `lesson_title_en` VARCHAR(191) NOT NULL,
    `lesson_title_pt` VARCHAR(191) NOT NULL,
    `lesson_title_es` VARCHAR(191) NOT NULL,
    `lesson_title_fr` VARCHAR(191) NOT NULL,
    `lesson_title_de` VARCHAR(191) NOT NULL,
    `lesson_title_it` VARCHAR(191) NOT NULL,
    `lesson_title_ru` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lesson_id` INTEGER NOT NULL,
    `lesson_type` VARCHAR(191) NOT NULL,
    `play_order` INTEGER NOT NULL,
    `podcast_language` VARCHAR(191) NOT NULL,
    `audio_en` VARCHAR(191) NULL,
    `audio_pt` VARCHAR(191) NULL,
    `audio_es` VARCHAR(191) NULL,
    `audio_fr` VARCHAR(191) NULL,
    `audio_de` VARCHAR(191) NULL,
    `audio_it` VARCHAR(191) NULL,
    `audio_ru` VARCHAR(191) NULL,
    `text_en` VARCHAR(191) NULL,
    `text_pt` VARCHAR(191) NULL,
    `text_es` VARCHAR(191) NULL,
    `text_fr` VARCHAR(191) NULL,
    `text_de` VARCHAR(191) NULL,
    `text_it` VARCHAR(191) NULL,
    `text_ru` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LessonContent` ADD CONSTRAINT `LessonContent_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
