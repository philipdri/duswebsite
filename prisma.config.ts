import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    // Prefer the direct (unpooled) connection for migrations.
    // The Neon Vercel integration sets DATABASE_URL_UNPOOLED for the direct URL
    // and DATABASE_URL for the pooled (pgbouncer) URL.
    // Migrations require a direct connection; queries can use the pooled URL.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
})
