CREATE TABLE `Blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime DEFAULT '2025-11-06 11:40:48.147',
	`name` varchar(15) NOT NULL,
	`description` varchar(500) NOT NULL,
	`websiteUrl` varchar(100) NOT NULL,
	`isMembership` boolean DEFAULT false,
	CONSTRAINT `Blogs_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime DEFAULT '2025-11-06 11:40:48.147',
	`title` varchar(30) NOT NULL,
	`shortDescription` varchar(100) NOT NULL,
	`content` varchar(1000) NOT NULL,
	`userId` int NOT NULL,
	CONSTRAINT `Posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Users` DROP INDEX `Users_password_unique`;--> statement-breakpoint
ALTER TABLE `Users` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 11:40:48.147';--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 11:40:48.147';--> statement-breakpoint
ALTER TABLE `moduleActions` MODIFY COLUMN `updatedAt` datetime DEFAULT '2025-11-06 11:40:48.147';--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 11:40:48.146';--> statement-breakpoint
ALTER TABLE `Modules` MODIFY COLUMN `updatedAt` datetime DEFAULT '2025-11-06 11:40:48.146';--> statement-breakpoint
ALTER TABLE `User_Tokens` MODIFY COLUMN `createdAt` datetime DEFAULT '2025-11-06 11:40:48.147';--> statement-breakpoint
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_userId_Blogs_id_fk` FOREIGN KEY (`userId`) REFERENCES `Blogs`(`id`) ON DELETE cascade ON UPDATE no action;