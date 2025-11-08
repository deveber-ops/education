ALTER TABLE `registrationSessions` ADD `login` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `registrationSessions` ADD `password` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `registrationSessions` ADD CONSTRAINT `user_email_idx` UNIQUE(`email`);