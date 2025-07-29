# Prisma Database Guide

## 🎯 Prisma vs TypeORM - Why We Migrated

### ✅ Benefits of Prisma:

1. **Type Safety**: Auto-generated TypeScript types from schema
2. **Better Developer Experience**: Excellent IDE support and autocomplete
3. **Schema-First**: Single source of truth in `schema.prisma`
4. **Modern Query Builder**: Intuitive and type-safe queries
5. **Migration System**: Declarative migrations with automatic SQL generation
6. **Prisma Studio**: Beautiful database browser UI

## 📋 Available Prisma Commands

### Schema Management

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Open Prisma Studio (Database Browser)
npm run prisma:studio
```

### Migration Commands

```bash
# Create and apply migration in development
npm run prisma:migrate

# Reset database (DESTRUCTIVE - loses all data)
npm run prisma:reset

# Deploy migrations to production
npm run prisma:deploy
```

## 📝 Schema File (`prisma/schema.prisma`)

```prisma
// Current User model
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  name         String
  password     String
  age          Int?
  refreshToken String?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## 🔄 Migration Workflow

### 1. Making Schema Changes

Edit `prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields
  role String @default("user")  // Add new field
}
```

### 2. Create Migration

```bash
npm run prisma:migrate
# Prisma will prompt for migration name: "add-user-role"
```

### 3. What Happens

- Prisma generates SQL migration file
- Applies migration to database
- Regenerates Prisma Client with new types
- Your TypeScript code now has type safety for the new field

## 📊 Viewing Migrations

### Migration Files Location:

```
prisma/
├── migrations/
│   ├── 20250729061101_initial_migration/
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

### Check Migration Status:

```bash
# Via Prisma Studio
npm run prisma:studio

# Or check migration files directly
ls -la prisma/migrations/
```

## 🚀 Using Prisma in Code

### Query Examples:

```typescript
// Find all users (type-safe)
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    // password: false (excluded automatically)
  },
});

// Create user with full type safety
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'hashedPassword',
  },
});

// Advanced queries with relations (when you add them)
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});
```

## 🔍 Prisma Studio

Launch the database browser:

```bash
npm run prisma:studio
```

- **URL**: `http://localhost:5555`
- **Features**: Browse, edit, and query your data visually
- **Real-time**: See changes instantly

## 🏗️ Adding New Models

1. **Add to Schema**:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

// Update User model
model User {
  // ... existing fields
  posts Post[]  // Add relation
}
```

2. **Create Migration**:

```bash
npm run prisma:migrate
# Name: "add-posts-table"
```

3. **Use in Code**:

```typescript
// Prisma Client is automatically updated
const postWithAuthor = await prisma.post.findUnique({
  where: { id: 1 },
  include: { author: true },
});
```

## ⚡ Performance Features

### Connection Pooling

```typescript
// Prisma handles connection pooling automatically
// Configure in schema.prisma if needed:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pooling is automatic
}
```

### Query Optimization

```typescript
// Efficient queries with select
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    // Only fetch needed fields
  },
});

// Batch operations
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ],
});
```

## 🛡️ Production Best Practices

### Environment Variables

```bash
# Development
DATABASE_URL="postgresql://nestuser:nestpass@localhost:5432/nestdb"

# Production (use connection pooling)
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10"
```

### Migration Deployment

```bash
# In production CI/CD
npm run prisma:deploy  # Only applies migrations, no prompts
```

### Error Handling

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

try {
  await prisma.user.create({ data: { email: 'duplicate@email.com' } });
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new ConflictException('Email already exists');
    }
  }
}
```

## 🔄 Rollback Strategy

### Revert Last Migration

```bash
npm run prisma:reset  # Nuclear option - resets entire DB
```

### Manual Rollback (Production)

1. Create reverse migration manually
2. Apply via `prisma migrate deploy`
3. Update schema.prisma to match

This guide covers everything you need to work with Prisma effectively!
