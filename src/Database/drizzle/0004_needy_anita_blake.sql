ALTER TABLE `Blogs` MODIFY COLUMN `createdAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `createdAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `createdAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `createdAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `createdAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `User_Tokens` MODIFY COLUMN `createdAt` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `Posts` ADD `blogName` varchar(15) NOT NULL;