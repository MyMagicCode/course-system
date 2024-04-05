/*
  Warnings:

  - You are about to drop the column `position` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `classroomId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Exam` DROP COLUMN `position`,
    ADD COLUMN `classroomId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `courseOnTeacher` (
    `courseId` INTEGER NOT NULL,
    `tecaherId` INTEGER NOT NULL,

    PRIMARY KEY (`courseId`, `tecaherId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courseOnTeacher` ADD CONSTRAINT `courseOnTeacher_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courseOnTeacher` ADD CONSTRAINT `courseOnTeacher_tecaherId_fkey` FOREIGN KEY (`tecaherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `Classroom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
