ALTER TABLE `Comments` MODIFY COLUMN `content` varchar(300) NOT NULL;--> statement-breakpoint
ALTER TABLE `Comments` MODIFY COLUMN `commentatorInfo` json NOT NULL;