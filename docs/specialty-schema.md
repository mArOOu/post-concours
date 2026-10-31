# Specialty Schema

This document defines the canonical field set for a specialty record.

The schema should stay stable so the profile pages, admin forms, and Firestore documents all use the same structure.

Algorithm values live in [specialty-profile-schema.md](specialty-profile-schema.md), not here.

## Core fields

| Field                  | Type      | Required | Description                                                              |
| ---------------------- | --------- | -------- | ------------------------------------------------------------------------ |
| `id`                   | string    | Yes      | Unique internal identifier for the specialty document.                   |
| `slug`                 | string    | Yes      | URL-safe identifier used in routes such as `/specialties/[slug]`.        |
| `name`                 | string    | Yes      | Human-readable specialty name.                                           |
| `category`             | string    | Yes      | Broad medical category, such as surgical, medical, diagnostic, or mixed. |
| `overview`             | string    | Yes      | Short summary of what the specialty is about.                            |
| `typicalDay`           | string    | Yes      | Narrative description of a normal day in the specialty.                  |
| `residency`            | string    | Yes      | Narrative description of residency training, duration, and structure.    |
| `pros`                 | string[]  | Yes      | List of strengths or advantages of the specialty.                        |
| `cons`                 | string[]  | Yes      | List of drawbacks or tradeoffs of the specialty.                         |
| `commonDiseases`       | string[]  | Yes      | Common diseases, conditions, or case types handled in the specialty.     |
| `faqIds`               | string[]  | No       | References to FAQ entries related to the specialty.                      |
| `residentInterviewIds` | string[]  | No       | References to resident interview records linked to the specialty.        |
| `active`               | boolean   | Yes      | Whether the specialty is shown in the product and included in matching.  |
| `createdAt`            | timestamp | Yes      | Document creation timestamp.                                             |
| `updatedAt`            | timestamp | Yes      | Document last updated timestamp.                                         |

## Display fields

| Field          | Type     | Required | Description                                                     |
| -------------- | -------- | -------- | --------------------------------------------------------------- |
| `shortSummary` | string   | No       | One-line summary used in cards or previews.                     |
| `keywords`     | string[] | No       | Search terms and labels that help users discover the specialty. |
| `imageUrl`     | string   | No       | Optional image or illustration for the specialty profile page.  |
| `icon`         | string   | No       | Optional icon name or identifier for UI presentation.           |

## Administrative fields

| Field            | Type      | Required | Description                                                                                             |
| ---------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `createdBy`      | string    | No       | User or admin identifier that created the record.                                                       |
| `updatedBy`      | string    | No       | User or admin identifier that last updated the record.                                                  |
| `source`         | string    | No       | Notes about where the data came from, such as resident interviews, admin research, or editorial review. |
| `lastReviewedAt` | timestamp | No       | Last time the record was checked for accuracy.                                                          |
| `reviewStatus`   | string    | No       | Editorial state such as draft, reviewed, or published.                                                  |

## Recommended shape

```ts
type Specialty = {
  id: string;
  slug: string;
  name: string;
  category: string;
  overview: string;
  typicalDay: string;
  residency: string;
  pros: string[];
  cons: string[];
  commonDiseases: string[];
  faqIds?: string[];
  residentInterviewIds?: string[];
  active: boolean;
  shortSummary?: string;
  keywords?: string[];
  imageUrl?: string;
  icon?: string;
  createdBy?: string;
  updatedBy?: string;
  source?: string;
  lastReviewedAt?: Timestamp;
  reviewStatus?: "draft" | "reviewed" | "published";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

## Usage notes

- Keep `slug` stable once a route has been published.
- If the profile content is incomplete, keep the record `active: false` until it is ready to ship.
- Store arrays as ordered lists when the order matters for presentation.
- Use `faqIds` and `residentInterviewIds` as references rather than embedding large content blocks directly in the specialty record.
