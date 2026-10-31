# Firebase and production setup

This application is a Next.js 16 App Router application backed by Firebase
Authentication and Cloud Firestore. The browser uses Firebase Auth for the
admin login. All application data is read and written by Next.js server code
with the Firebase Admin SDK; public users do not need a Firebase account.

## 1. Install and run the application

Use Node.js 20 or newer, then from the repository root:

```powershell
npm ci
Copy-Item .env.local.example .env.local
```

Do not commit `.env.local`. The Firebase private key must exist only in local
environment variables or the deployment provider's encrypted environment
settings.

## 2. Create the Firebase project

1. Open the Firebase Console and create a project.
2. Enable **Firestore Database** in production mode and choose the region
   closest to your users. The region cannot be changed later.
3. Enable **Authentication > Sign-in method > Email/Password**.
4. Add an initial admin user under **Authentication > Users**.
5. In **Project settings > General**, register a Web app and copy its config
   values into the `NEXT_PUBLIC_FIREBASE_*` variables.
6. In **Project settings > Service accounts**, create a private key. Copy:
   - `project_id` to `FIREBASE_PROJECT_ID`
   - `client_email` to `FIREBASE_CLIENT_EMAIL`
   - the complete `private_key` to `FIREBASE_PRIVATE_KEY`

For `FIREBASE_PRIVATE_KEY`, preserve the escaped `\n` sequences when putting
the value in `.env.local`. The server converts them to real line breaks.

## 3. Apply Firestore access rules

The repository includes [firestore.rules](../firestore.rules). Deploy it with
the Firebase CLI if you use the CLI:

```powershell
npm install -g firebase-tools
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules
```

These rules intentionally deny direct browser access. The Next.js server uses
the Admin SDK, which is not governed by client Firestore rules. Do not loosen
these rules unless you deliberately move data access into the browser.

## 4. Configure local environment variables

Copy [.env.local.example](../.env.local.example) to `.env.local` and fill all
12 values. The six `NEXT_PUBLIC_*` values are safe client configuration; the
three `FIREBASE_*` service-account values are secrets.

Check the connection without exposing data:

```powershell
npm run dev
Invoke-WebRequest http://localhost:3000/api/health
```

A healthy response has `"success":true`. A 503 means an environment variable,
service-account value, project ID, or Firestore permission is wrong.

## 5. Seed the application collections

The seed script is idempotent: it creates missing documents and leaves
existing documents unchanged. After the health check succeeds:

```powershell
npm run seed
```

It creates the initial `specialties`, `questions`, `attributeDefinitions`, and
`scoringModels/baseline-v1` documents. The current seed is intentionally a
small demo dataset (three specialties and five questions). Add and editorially
review real content in the admin UI before inviting users.

The scoring data must remain linked:

| Collection | Link |
|---|---|
| `questions` | `traitIds` contains attribute IDs such as `lifestyle` |
| `attributeDefinitions` | IDs match the question `traitIds` and model `weights` |
| `scoringModels` | `weights` contains the attributes used by scoring |
| `specialties` | `attributeScores` maps those same IDs to values from 1 to 5 |
| `responses` | `answers` maps question IDs to integer values in each question's scale |

After editing questions or attributes, verify that every active question has at
least one valid `traitIds` entry and that every weighted attribute has a
specialty score. Missing legacy `traitIds` are normalized to an empty list, but
such a question contributes nothing to matching.

## 6. Bootstrap admin access

1. Sign in at `/admin/login` with the Firebase Auth user created in step 2.
2. Add an `admins/{UID}` document in Firestore, where `{UID}` is the user's
   Firebase Authentication UID.
3. Set its data to `{ "active": true, "email": "admin@example.com" }`.
4. Sign out and sign in again.

The API checks both the Firebase ID token and the `admins` allowlist. A valid
Firebase user without this document is denied.

## 7. Verify the complete flow locally

Run:

```powershell
npm run lint
npm run build
npm run dev
```

Then verify in this order:

1. `/specialties` loads seeded specialties.
2. `/questionnaire` loads active questions.
3. Answer one or more questions and submit.
4. The result URL `/results/{responseId}` shows match scores.
5. `/admin/login` authenticates the admin.
6. Admin pages can edit questions, specialties, scores, FAQ, and interviews.
7. `/admin/analytics` renders without errors after a response exists.

## 8. Deploy to Vercel

1. Import the repository into Vercel.
2. Set the same six `NEXT_PUBLIC_FIREBASE_*` variables and three server-only
   `FIREBASE_*` variables in the Vercel project settings for Preview and
   Production.
3. Deploy with the default Next.js build command (`npm run build`).
4. Add the deployed domain to Firebase Authentication's authorized domains.
5. Run the seed once against the intended Firebase project from a trusted
   machine, using that project's service-account environment variables.
6. Check `/api/health`, then test the public questionnaire and admin login.

Never put the service-account private key in `NEXT_PUBLIC_*`, client code,
Firestore documents, GitHub Actions logs, or the repository.

## 9. Before public launch

- Replace demo specialties/questions with reviewed local residency data.
- Add a privacy notice and define response retention/deletion.
- Add rate limiting or bot protection to `POST /api/responses`.
- Configure Firebase backups and billing alerts.
- Create a separate Firebase project for staging.
- Monitor `/api/health` and deployment logs.
- Test admin authorization and malformed submissions after every deployment.
