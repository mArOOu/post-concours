# Residency Specialty

Residency Specialty is a Next.js application for exploring medical
specialties and matching a candidate's preferences to specialty profiles.
It includes:

- A public specialty explorer.
- A public questionnaire and scored results page.
- Firebase-backed specialty, question, FAQ, interview, and scoring data.
- An authenticated admin workspace for editing content and scoring settings.

The application is currently an MVP foundation. The seed data contains only a
small demo set of specialties and questions; it must be expanded and
editorially reviewed before public launch.

## Requirements

- Node.js 20 or newer.
- A Firebase project with Firestore and Email/Password Authentication enabled.
- A Firebase Web app configuration.
- A Firebase Admin service-account key for the Next.js server.

## Quick start

From the repository root:

```powershell
npm ci
Copy-Item .env.local.example .env.local
```

Fill in `.env.local` with the Firebase values described in
[docs/backend-setup.md](docs/backend-setup.md). Then verify connectivity,
seed the initial collections, and start Next.js:

```powershell
npm run dev
Invoke-WebRequest http://localhost:3000/api/health
npm run seed
```

Open <http://localhost:3000>. The public questionnaire is at
`/questionnaire`; the admin login is at `/admin/login`.

The seed script is idempotent for missing documents. It does not overwrite
existing editorial data.

## Development commands

```powershell
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Type-check and create a production build
npm run start     # Serve the production build
npm run seed      # Create the initial Firestore documents
```

Run `npm run lint` and `npm run build` before deploying. Both commands are
expected to pass without a live Firebase connection because the build only
checks the application bundle and prerender contracts.

## Firebase architecture

The browser uses Firebase Authentication for the admin sign-in flow. The
Next.js server uses Firebase Admin for Firestore reads and writes. Public
users do not receive direct Firestore access and do not need an account.

Important collections:

| Collection | Purpose |
|---|---|
| `specialties` | Public specialty content and 1–5 attribute scores |
| `questions` | Active questionnaire questions and their `traitIds` |
| `attributeDefinitions` | The editable scoring dimensions |
| `scoringModels` | Weighted scoring configuration, including `baseline-v1` |
| `responses` | Validated public questionnaire submissions |
| `admins` | Firebase UID allowlist for admin access |
| `faq` | FAQ content |
| `residentInterviews` | Structured resident interview content |

Question `traitIds`, scoring-model weight keys, and specialty
`attributeScores` must use the same attribute IDs. The server normalizes
legacy questions with missing `traitIds`, but those questions cannot
contribute to a match until corrected.

## Admin access

Creating a Firebase Authentication user is not sufficient. After the first
user is created, add an `admins/{UID}` Firestore document with:

```json
{
  "active": true,
  "email": "admin@example.com"
}
```

Replace `{UID}` with the user's Firebase Authentication UID. The complete
Firebase setup, Firestore rules, environment configuration, seed process, and
Vercel deployment procedure are in
[docs/backend-setup.md](docs/backend-setup.md).

## Security and operations

- Never commit `.env.local` or a Firebase private key.
- Deploy [firestore.rules](firestore.rules); they deny direct browser access.
- Use a separate Firebase project for staging and production.
- Configure Firestore backups and billing alerts before launch.
- Add rate limiting or bot protection to public response submission.
- Publish a privacy notice and define response retention/deletion.

## Current scope and known limitations

- The seed dataset is demonstration content, not a complete residency
  directory.
- The comparison page now provides a working side-by-side frontend; its
  scores are only as trustworthy as the specialty profile data behind them.
- Recommendation quality depends on reviewed specialty attribute scores and
  well-linked question traits.
- There is no automated test suite yet; lint and production build are the
  current local gates.

## Documentation

- [Firebase and production setup](docs/backend-setup.md)
- [Specialty schema](docs/specialty-schema.md)
- [Specialty profile schema](docs/specialty-profile-schema.md)
- [Questionnaire attributes](docs/attributes.md)
- [Resident interview template](opinion.md)
