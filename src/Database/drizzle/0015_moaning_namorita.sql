ALTER TABLE `registrationSessions` DROP INDEX `user_email_idx`;--> statement-breakpoint
ALTER TABLE `registrationSessions` ADD CONSTRAINT `registrationSessions_login_unique` UNIQUE(`login`);