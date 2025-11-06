ALTER TABLE `Users` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-05 10:22:38.171';--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-05 10:22:38.171';--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `updatedAt` datetime DEFAULT '2025-11-05 10:22:38.171';--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-05 10:22:38.170';--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `updatedAt` datetime DEFAULT '2025-11-05 10:22:38.171';--> statement-breakpoint
ALTER TABLE `User_Tokens` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-05 10:22:38.171';--> statement-breakpoint
ALTER TABLE `Users` ADD CONSTRAINT `user_login_idx` UNIQUE(`login`);--> statement-breakpoint
ALTER TABLE `Users` ADD CONSTRAINT `user_email_idx` UNIQUE(`email`);