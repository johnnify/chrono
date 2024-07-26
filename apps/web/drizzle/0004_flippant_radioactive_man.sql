CREATE TABLE `cached_ai_responses` (
	`prompt` text PRIMARY KEY NOT NULL,
	`response` text NOT NULL,
	`created_at` integer NOT NULL
);
