CREATE TABLE `agenda_items` (
	`id` text PRIMARY KEY NOT NULL,
	`livestream_id` text NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`started_at` integer,
	`stream_timestamp` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`livestream_id`) REFERENCES `livestreams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `agenda_item_order_index` ON `agenda_items` (`order`);
