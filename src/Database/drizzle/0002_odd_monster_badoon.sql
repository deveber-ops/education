ALTER TABLE `Users` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 09:21:27.923';--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 09:21:27.923';--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `updatedAt` datetime DEFAULT '2025-11-06 09:21:27.923';--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 09:21:27.923';--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `updatedAt` datetime DEFAULT '2025-11-06 09:21:27.923';--> statement-breakpoint
ALTER TABLE `User_Tokens` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 09:21:27.923';--> statement-breakpoint
ALTER TABLE `moduleActions` DROP COLUMN `sort_order`;