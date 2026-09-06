# Cloubee

Self-hosted cloud storage with file management, user accounts, storage quotas, and an admin interface.


## Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/52509dbf-2fcb-4d43-a046-499aba188553" alt="Cloubee" />
</p>


## At a glance

- **What it is:** A web application for managing files and folders on infrastructure you operate.
- **Why it exists:** It keeps storage in a self-hosted, inspectable deployment instead of requiring a third-party storage service.
- **Current implementation:** Auth-protected file and folder CRUD, streaming single-file uploads, single or multi-file downloads (multi-file downloads are ZIP archives), trash and restore, permanent deletion, user settings, and administration workflows.
- **Technical highlights:** Sortable file listings with three view modes, best-effort image/video thumbnails, first-admin bootstrap, invite-token registration, RU/EN localization, system light/dark theme support, and desktop/mobile interaction patterns.
- **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Radix UI, React Query, Zustand, NestJS 10, Prisma, PostgreSQL 15, Passport JWT, bcrypt, Sharp, FFmpeg, Swagger, and Docker Compose for PostgreSQL only.
- **Run locally:** Start PostgreSQL, configure the two application env files, push the Prisma schema, then run the NestJS API and Next.js client. The exact commands are below.

Cloubee is functional but not production-ready. Read [Status and limitations](#status-and-limitations) and [Security](#security) before exposing it to untrusted users.

## Local development

### 1. Configure the environment

Create `server/.env`:

```dotenv
NODE_ENV=development
APPLICATION_PORT=8080
ALLOWED_ORIGIN=http://localhost:3000

POSTGRES_USER=cloubee
POSTGRES_PASSWORD=local-change-me
POSTGRES_URI=postgresql://cloubee:local-change-me@localhost:5432/cloubee

JWT_SECRET=local-only-replace-with-a-long-random-secret
JWT_EXPIRE_IN=1d
STORAGE_PATH=./storage
STORAGE_TOTAL_POOL_BYTES=10737418240
```

`NODE_ENV=development` enables local dotenv loading. `POSTGRES_USER` and `POSTGRES_PASSWORD` are read by the PostgreSQL Compose service. Because Compose does not set `POSTGRES_DB`, PostgreSQL uses `POSTGRES_USER` (`cloubee`) as the database name, so `POSTGRES_URI` uses the same credentials and points to `localhost:5432/cloubee`. `STORAGE_TOTAL_POOL_BYTES` is the combined byte limit for all users' stored files; this local example allows 10 GiB. Keep real credentials and secrets out of version control.

Create `client/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

The client should use the API at `http://localhost:8080`, while the browser application is served at `http://localhost:3000`.

### 2. Start PostgreSQL

In a terminal from the repository root:

```bash
cd server && docker compose up -d
```

Docker Compose starts PostgreSQL 15 and persists its data in the `postgres_data` volume. Compose is used here for PostgreSQL only; the API and client run directly on the host.

### 3. Install and start the API

In a second terminal:

```bash
cd server
npm install
npx prisma generate
npm run db:push
npm run start:dev
```

When using the example `APPLICATION_PORT=8080`, the API listens on port `8080`; Swagger UI is available at [`http://localhost:8080/swagger`](http://localhost:8080/swagger), and the generated Swagger document is exposed at `/swagger/yaml`.

### 4. Install and start the client

In a third terminal:

```bash
cd client
bun install
bun run dev
```

Open [`http://localhost:3000`](http://localhost:3000) in a browser.

`prisma db push` is used for the current local setup. This project does not currently provide migration history, so review schema changes before applying them to any persistent database.

## Implemented scope

### Files and folders

- Create folders and perform authenticated file/folder CRUD.
- Upload one file as a stream.
- Download one file or download multiple files as a ZIP archive.
- Sort file listings and switch among three view modes.
- Move items to trash, restore them, or permanently delete them.
- Generate best-effort thumbnails for supported image and video uploads.

### Accounts and administration

- Bootstrap the first administrator account.
- Register additional users with an invite token.
- Authenticate users with the account flow.
- Update profile settings.
- Let administrators manage users, storage quotas, and invitations.

### Client experience

- RU/EN localization.
- System light/dark theme support.
- Interaction patterns for desktop and mobile layouts.

## Architecture

The client talks to the NestJS API, which applies authentication and role checks before coordinating Prisma/PostgreSQL state and local filesystem operations. During supported image and video uploads, the server best-effort generates thumbnails; those thumbnails are served later when requested.

```mermaid
flowchart LR
    Browser["Next.js client\nReact 19"] -->|HTTP API| API["NestJS API\nAuth and file modules"]
    API --> Prisma["Prisma"]
    Prisma --> DB[("PostgreSQL 15")]
    API --> FS["Local filesystem"]
    API --> Media["Sharp / FFmpeg\nthumbnail processing"]
```

This is a single-node design: the database and the file bytes are local to the server deployment. The database records and filesystem mutations are separate operations.

## Project structure

```text
server/
  src/
    core/                 Application-wide modules, including Prisma
    modules/auth/         Login and registration flows
    modules/files/        File and folder operations
    modules/invites/      Invitation management
    modules/users/        Profile and administrator user operations
    shared/               Guards, decorators, interceptors, and utilities
  prisma/                 Prisma schema
  docker-compose.yml      PostgreSQL 15 service

client/
  src/
    app/                  Next.js routes and pages
    components/           UI, layout, and file explorer components
    libs/api/             API clients, types, and query hooks
    libs/store/           Client-side file state
    libs/i18n/             Localization configuration
    schemas/              Form and request validation schemas
```

## Status and limitations

- Storage currently uses the local filesystem on a single node; it is not an object-storage or multi-node deployment.
- Environment and database setup is manual.
- There is no migration history or test suite at present.
- Invite email delivery and invitation expiry are not implemented.
- Password recovery is not implemented.
- Quota updates and filesystem/database changes are non-transactional and can diverge if an operation fails partway through.
- Upload and path validation still need strengthening.
- Thumbnail generation is best-effort for images and videos; this is not a full file-viewer implementation.
- The application has not been hardened for untrusted production use.

## Security

The server uses Passport JWT and bcrypt, applies authentication and role guards to protected operations, and configures an explicit CORS origin list through `ALLOWED_ORIGIN` with credentials enabled. Keep `.env` files private, use strong deployment-specific credentials, and place local development behind an appropriately configured HTTPS boundary when serving real users.

Before untrusted production use, the application needs stronger upload and path validation and additional auth hardening, including rate limiting, CSRF protection, and session revocation. Review the non-transactional quota, filesystem, and database behavior when designing recovery procedures and backups.

## Development commands

From `server/`:

```bash
npm install
npx prisma generate
npm run db:push
npm run start:dev
```

From `client/`:

```bash
bun install
bun run dev
```

The server package's production workflow is `npm run build` followed by `npm run start:prod`; `npm run start` invokes Nest directly. The client package exposes `bun run build` and `bun run start` for a Next.js production-style local run. Those commands do not change the storage architecture or the limitations described above.

## Contributing

1. Fork the repository and create a focused branch.
2. Keep changes scoped to a documented behavior or defect.
3. For API, schema, or environment changes, update the relevant setup and security notes in the same change.
4. Run the local development flow, describe the exercised behavior, and include any limitations in the pull request.

## License

Cloubee is available under the [MIT License](LICENSE).
