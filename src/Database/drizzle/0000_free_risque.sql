CREATE TABLE `Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime DEFAULT '2025-11-05 09:30:41.048',
	`email` varchar(100) NOT NULL,
	`login` varchar(100) NOT NULL,
	`password` varchar(100) NOT NULL,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`),
	CONSTRAINT `Users_email_unique` UNIQUE(`email`),
	CONSTRAINT `Users_login_unique` UNIQUE(`login`),
	CONSTRAINT `Users_password_unique` UNIQUE(`password`)
);
--> statement-breakpoint
CREATE TABLE `moduleActions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int,
	`name` varchar(100) NOT NULL,
	`path` varchar(200) NOT NULL,
	`label` varchar(200) NOT NULL,
	`method` varchar(10) DEFAULT 'GET',
	`authorization` boolean DEFAULT false,
	`active` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`createdAt` datetime DEFAULT '2025-11-05 09:30:41.048',
	`updatedAt` datetime DEFAULT '2025-11-05 09:30:41.048',
	CONSTRAINT `moduleActions_id` PRIMARY KEY(`id`),
	CONSTRAINT `module_method_path_unique` UNIQUE(`moduleId`,`method`,`path`)
);
--> statement-breakpoint
CREATE TABLE `Modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`label` varchar(200) NOT NULL,
	`path` varchar(100) NOT NULL,
	`system` boolean DEFAULT false,
	`active` boolean DEFAULT true,
	`menu` boolean DEFAULT false,
	`createdAt` datetime DEFAULT '2025-11-05 09:30:41.048',
	`updatedAt` datetime DEFAULT '2025-11-05 09:30:41.048',
	CONSTRAINT `Modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `Modules_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `User_Tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime DEFAULT '2025-11-05 09:30:41.048',
	CONSTRAINT `User_Tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `moduleActions` ADD CONSTRAINT `moduleActions_moduleId_Modules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `Modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User_Tokens` ADD CONSTRAINT `User_Tokens_userId_Users_id_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE cascade ON UPDATE no action;