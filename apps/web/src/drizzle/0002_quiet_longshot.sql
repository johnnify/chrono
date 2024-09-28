CREATE TABLE `agenda_events` (
	`id` text PRIMARY KEY NOT NULL,
	`livestream_id` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`livestream_id`) REFERENCES `livestreams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `created_at_idx_ac8e3a06-1981-4945-9a22-825290978d85` ON `agenda_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `created_at_idx_1c881302-e3b3-45c9-9d21-a1e6c726e41b` ON `livestreams` (`created_at`);