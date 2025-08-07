-- CreateTable
CREATE TABLE `langlearn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang_code` VARCHAR(191) NOT NULL,
    `learn_code` VARCHAR(191) NOT NULL,
    `learn_title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `langnative` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang_code` VARCHAR(191) NOT NULL,
    `lang_name` VARCHAR(191) NOT NULL,
    `native_title` VARCHAR(191) NOT NULL,
    `lang_flag` VARCHAR(191) NOT NULL,
    `native_order` INTEGER NOT NULL,

    UNIQUE INDEX `LangNative_lang_code_key`(`lang_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lesson` (
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
CREATE TABLE `lessoncontent` (
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

    INDEX `LessonContent_lesson_id_fkey`(`lesson_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `translation` (
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
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lang_native` VARCHAR(191) NOT NULL,
    `is_premium` BOOLEAN NOT NULL DEFAULT false,
    `stripe_customer_id` VARCHAR(191) NULL,
    `subscription_status` VARCHAR(191) NULL,
    `subscription_renewal` DATETIME(3) NULL,
    `password` VARCHAR(191) NOT NULL,
    `security_question` VARCHAR(191) NULL,
    `security_answer_hash` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `platform` ENUM('GOOGLE_ADS', 'META_ADS', 'X_ADS') NOT NULL,
    `status` ENUM('ACTIVE', 'PAUSED', 'COMPLETED', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `budget` DOUBLE NULL,
    `currency` VARCHAR(191) NULL DEFAULT 'BRL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `google_ads_tags` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `gclid` VARCHAR(191) NULL,
    `utm_source` VARCHAR(191) NOT NULL DEFAULT 'google',
    `utm_medium` VARCHAR(191) NOT NULL DEFAULT 'cpc',
    `utm_campaign` VARCHAR(191) NOT NULL,
    `utm_term` VARCHAR(191) NULL,
    `utm_content` VARCHAR(191) NULL,
    `adGroupId` VARCHAR(191) NULL,
    `keywordId` VARCHAR(191) NULL,
    `creativeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `google_ads_tags_campaignId_key`(`campaignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meta_ads_tags` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `fbclid` VARCHAR(191) NULL,
    `utm_source` VARCHAR(191) NOT NULL DEFAULT 'facebook',
    `utm_medium` VARCHAR(191) NOT NULL DEFAULT 'cpc',
    `utm_campaign` VARCHAR(191) NOT NULL,
    `utm_content` VARCHAR(191) NULL,
    `adSetId` VARCHAR(191) NULL,
    `adId` VARCHAR(191) NULL,
    `placement` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `meta_ads_tags_campaignId_key`(`campaignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_ads_tags` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `twclid` VARCHAR(191) NULL,
    `utm_source` VARCHAR(191) NOT NULL DEFAULT 'twitter',
    `utm_medium` VARCHAR(191) NOT NULL DEFAULT 'cpc',
    `utm_campaign` VARCHAR(191) NOT NULL,
    `utm_content` VARCHAR(191) NULL,
    `tweetId` VARCHAR(191) NULL,
    `lineItemId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_ads_tags_campaignId_key`(`campaignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `eventAction` VARCHAR(191) NULL,
    `eventCategory` VARCHAR(191) NULL,
    `eventLabel` VARCHAR(191) NULL,
    `value` DOUBLE NULL,
    `currency` VARCHAR(191) NULL DEFAULT 'BRL',
    `userId` VARCHAR(191) NULL,
    `sessionId` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `utmSource` VARCHAR(191) NULL,
    `utmMedium` VARCHAR(191) NULL,
    `utmCampaign` VARCHAR(191) NULL,
    `utmTerm` VARCHAR(191) NULL,
    `utmContent` VARCHAR(191) NULL,
    `referrer` VARCHAR(191) NULL,
    `gaClientId` VARCHAR(191) NULL,
    `ga4MeasurementId` VARCHAR(191) NULL,
    `pageUrl` VARCHAR(191) NULL,
    `pageTitle` VARCHAR(191) NULL,
    `eventTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `events_eventName_idx`(`eventName`),
    INDEX `events_campaignId_idx`(`campaignId`),
    INDEX `events_eventTime_idx`(`eventTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lessoncontent` ADD CONSTRAINT `LessonContent_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `google_ads_tags` ADD CONSTRAINT `google_ads_tags_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meta_ads_tags` ADD CONSTRAINT `meta_ads_tags_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_ads_tags` ADD CONSTRAINT `x_ads_tags_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
