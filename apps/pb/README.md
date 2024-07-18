# PocketBase Stack

[PocketBase](https://pocketbase.io/) is the "Open Source backend" that is the backbone of this app.

It takes care of storage with SQLite, the admin / CMS interface to manage the data, as well as handy API endpoints to connect to it over HTTP.

## Production Links

- [Admin dashboard](https://chrono-pb.fly.dev/_): Manage the data there!
- [Rest API](https://chrono-pb.fly.dev/api): Other apps connect to the data there!

## Make sure to give Docker permissions to access this directory!

During local development, we're syncing the data from the Docker container to your local machine, including the `pb_data` directory you may want to persist or generate Typescript migrations from, and most importantly the `pb_migrations` directory, where PocketBase stores the migration files it automatically generates when we modify things through the admin dashboard.

Also the `pb_hooks` [for advanced usage](https://pocketbase.io/docs/js-overview/), where you can add some `*.pb.js` JavaScript files for advanced usage.

## Active links during local development

- [Admin dashboard](http://127.0.0.1:8090/_): Manage the data there!
- [Rest API](http://127.0.0.1:8090/api): Other apps connect to the data there!

## Heavily featured tech

- [PocketBase](https://pocketbase.io/)
- [Docker](https://www.docker.com/)

## Handy scripts

In the `package.json`, you can find a few handy scripts you can run with `bun <script>`!

## Docker commands

Prefixed with `docker:`, there's commands that can run, start, stop and remove this app's Docker container. It's unlikely you'll need them, but they're there for you!

## PocketBase commands

**You need the Docker container running for these commands!**

Prefixed with `pb:`, there's a couple commands you can pass through the `pocketbase` executable inside the Docker container.

### Create new migration file

[More about PocketBase migrations](https://pocketbase.io/docs/js-migrations) in the official docs.

Migrations are automatically generated every time you create or update a collection (not a record, a collection! No data gets automatically migrated), but there's some instances where you might want your own migration. This is the command for you:

```sh
bun pb:migration-new "your_new_migration_name"
```

### Sync migration history

[More about syncing migrations](https://pocketbase.io/docs/js-migrations/#migrations-history) in the official docs.

If in doubt, never run this! But you may find it nice if you've been experimenting a lot in local development, and would rather have a cleaner migration history.

```
bun pb:migration-sync
```
