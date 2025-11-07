ALTER TABLE `Blogs` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `Comments` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);--> statement-breakpoint
ALTER TABLE `User_Tokens` MODIFY COLUMN `expiresAt` datetime(6) NOT NULL;--> statement-breakpoint
ALTER TABLE `User_Tokens` MODIFY COLUMN `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6);