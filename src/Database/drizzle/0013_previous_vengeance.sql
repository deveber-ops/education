ALTER TABLE `registrationSessions` DROP INDEX `registrationSessions_login_unique`;--> statement-breakpoint
ALTER TABLE `registrationSessions` DROP COLUMN `login`;--> statement-breakpoint
ALTER TABLE `registrationSessions` DROP COLUMN `password`;