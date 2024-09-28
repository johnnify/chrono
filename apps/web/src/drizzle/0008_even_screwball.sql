ALTER TABLE `users` ADD `password_hash` text;--> statement-breakpoint
ALTER TABLE `livestreams` ADD `published_at` integer;--> statement-breakpoint
CREATE INDEX `livestreams_published_at_index` ON `livestreams` (`published_at`);