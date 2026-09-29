# English Grammar for Fellows

An interactive English grammar learning application built with Next.js, featuring lessons and exercises covering Simple Present, Simple Past, Simple Future tenses, Verb to Be, Verb to Have, Question Tags, and Wh Questions.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://console.neon.tech) PostgreSQL database (free tier works)

### Setup

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd english-grammar-for-fellows
npm install
```

2. Copy `.env.example` to `.env.local` and add your Neon database URL:

```bash
cp .env.example .env.local
# Edit .env.local and set DATABASE_URL
```

3. Seed the database with unit data:

```bash
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database

### Seeding

The seed command validates all JSON data files and inserts unit metadata into the database:

```bash
npm run db:seed
```

This command is **idempotent** — safe to run multiple times. It will:

- Create all database tables if they don't exist (never deletes data)
- Validate every question has exactly 3 options and exactly 1 correct answer
- Insert new units or update existing ones (upsert)
- Preserve all user progress and exercise attempts

### Schema

| Table | Purpose |
|-------|---------|
| `units` | Unit metadata (title, lesson count, exercise count, question count) |
| `users` | Anonymous user identities |
| `exercise_attempts` | Individual question attempt records |
| `lesson_progress` | Per-unit progress summaries |

### Other Commands

```bash
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio
```

## Available Units

| Unit | Title | Lessons | Questions |
|------|-------|---------|-----------|
| 1 | Simple Present, Past & Future | 4 | 75 |
| 2 | Verb to Be (am, is, are, was, were) | 5 | 75 |
| 3 | Verb to Have (has, have, had) | 5 | 75 |
| 4 | Question Tags | 5 | 75 |
| 5 | Wh Questions | 5 | 75 |

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run validate  # Validate exercise data files
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Runtime**: React 19

## License and third-party content

The original application source code is licensed under the MIT License; see `LICENSE`.

The educational content used by this application may include or be based on third-party books, websites, examples, exercises, translations, answer keys, images, and other materials. Those materials are not automatically covered by the MIT License. Copyright and licensing rights remain with their respective owners. Source links are provided for attribution and further study; a source link alone is not permission to copy, redistribute, or use material commercially.

Where a source publishes an explicit license, follow that license for the applicable material. Where no explicit license is stated, treat the material as all rights reserved unless permission or another clearly applicable legal basis exists. Contact the project owner for attribution, correction, or removal requests.

Do not state that the entire project is MIT licensed unless every included asset and content item is owned by the project owner or separately permitted under compatible terms.
