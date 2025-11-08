CREATE TABLE `registrationSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100) NOT NULL,
	`login` varchar(100) NOT NULL,
	`password` varchar(100) NOT NULL,
	`code` varchar(32) NOT NULL,
	`createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	`lastSentAt` datetime(6) NOT NULL,
	`expiresAt` datetime(6) NOT NULL,
	`attempts` int DEFAULT 0,
	`isVerified` boolean DEFAULT false,
	CONSTRAINT `registrationSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `registrationSessions_email_unique` UNIQUE(`email`),
	CONSTRAINT `registrationSessions_login_unique` UNIQUE(`login`)
);
