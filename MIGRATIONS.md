# TypeORM Migrations Guide

## 📋 Available Migration Commands

### View Migrations Status

```bash
# Show all migrations and their status
npm run migration:show

# Example output:
# [X] InitialMigration1753769197082 (executed)
# [ ] AddUserRoles1753769297082 (pending)
```

### Generate Migrations (Auto-generated)

```bash
# Generate migration based on entity changes
npm run migration:generate src/migrations/MigrationName

# This will:
# 1. Compare current entities with database schema
# 2. Generate SQL to sync them
# 3. Create a new migration file
```

### Create Empty Migration (Manual)

```bash
# Create blank migration file for custom SQL
npm run migration:create src/migrations/MigrationName
```

### Run Migrations

```bash
# Run all pending migrations
npm run migration:run

# This will:
# 1. Execute all unrun migrations in order
# 2. Update migrations table
# 3. Apply schema changes to database
```

### Revert Migrations

```bash
# Revert the last executed migration
npm run migration:revert

# To revert multiple migrations, run this command multiple times
```

## 📁 Migration File Structure

### Generated Migration Example:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoles1753769297082 implements MigrationInterface {
  name = 'AddUserRoles1753769297082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // SQL to apply changes
    await queryRunner.query(`
            ALTER TABLE "users" 
            ADD "role" character varying NOT NULL DEFAULT 'user'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQL to revert changes
    await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "role"
        `);
  }
}
```

## 🔄 Migration Workflow

### Development Process:

1. **Make entity changes** (add/modify properties)
2. **Generate migration**: `npm run migration:generate src/migrations/DescriptiveName`
3. **Review the generated SQL** (in the migration file)
4. **Test the migration**: `npm run migration:run`
5. **If issues, revert**: `npm run migration:revert`

### Production Deployment:

1. **Build application**: `npm run build`
2. **Run migrations**: `npm run migration:run`
3. **Start application**: `npm run start:prod`

## 🗂️ Migration File Locations

```
src/
├── migrations/
│   ├── 1753769197082-InitialMigration.ts
│   ├── 1753769297082-AddUserRoles.ts
│   └── 1753769397082-CreatePostsTable.ts
```

## 🔍 Viewing Migration Status

### In Database:

TypeORM creates a `migrations` table automatically:

```sql
SELECT * FROM migrations;
-- Shows: id, timestamp, name
```

### Via Command:

```bash
npm run migration:show
```

Output example:

```
 [X] InitialMigration1753769197082
 [X] AddUserRoles1753769297082
 [ ] CreatePostsTable1753769397082
```

## ⚠️ Best Practices

### DO:

- ✅ Always review generated migrations before running
- ✅ Test migrations on development/staging first
- ✅ Keep migrations small and focused
- ✅ Use descriptive migration names
- ✅ Backup database before production migrations

### DON'T:

- ❌ Edit already executed migrations
- ❌ Delete migration files
- ❌ Skip migration testing
- ❌ Use `synchronize: true` in production

## 🚨 Common Issues & Solutions

### Issue: "Migration already exists"

```bash
# Delete the migration file and regenerate
rm src/migrations/1753769197082-InitialMigration.ts
npm run migration:generate src/migrations/InitialMigration
```

### Issue: "Migration failed"

```bash
# Revert and fix
npm run migration:revert
# Fix the issue, then regenerate
npm run migration:generate src/migrations/FixedMigration
```

### Issue: Database connection error

```bash
# Make sure database is running
docker compose up postgres
# Or check environment variables
```
