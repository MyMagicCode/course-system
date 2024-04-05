/*
  Warnings:

  - The primary key for the `courseOnTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tecaherId` on the `courseOnTeacher` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `courseOnTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `courseOnTeacher` DROP FOREIGN KEY `courseOnTeacher_tecaherId_fkey`;

-- AlterTable
ALTER TABLE `courseOnTeacher` DROP PRIMARY KEY,
    DROP COLUMN `tecaherId`,
    ADD COLUMN `teacherId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`courseId`, `teacherId`);

-- AddForeignKey
ALTER TABLE `courseOnTeacher` ADD CONSTRAINT `courseOnTeacher_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
