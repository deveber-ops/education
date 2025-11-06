CREATE TABLE `Comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
	`content` varchar(15) NOT NULL,
	`commentatorInfo` json,
	CONSTRAINT `Comments_id` PRIMARY KEY(`id`)
);
