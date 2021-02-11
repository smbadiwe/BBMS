
## Knowledgebase

### EF Migrations

Note: For all `dotnet ef` commands below, to specify the relevant environment (and the corresponding database), append ` -- [ENV]` to the command. Here, `[ENV]` could be either of `dev` (the default), `live` or `stage`.

#### To create a new migration

Use `dotnet ef migrations add`.

#### To undo the latest migration

Use `dotnet ef migrations remove`.

#### To apply the latest migration to database

Use `dotnet ef database update`.

#### FOR MORE DETAILS...

See https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying?tabs=dotnet-core-cli
