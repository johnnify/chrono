CREATE TABLE `cached_generated_images` (
	`prompt` text PRIMARY KEY NOT NULL,
	`response` text NOT NULL,
	`created_at` integer NOT NULL
);
