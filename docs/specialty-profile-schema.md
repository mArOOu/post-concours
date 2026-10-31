# Specialty Profile Schema

This document contains only algorithm data for a specialty profile.

Use it for matching, scoring, and result tracking. It should not contain narrative profile content.

Store these documents in the `specialtyProfiles` collection.

## Fields

| Field               | Type                   | Required | Description                                                                                             |
| ------------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `specialtyId`       | string                 | Yes      | Unique identifier of the specialty this profile belongs to.                                             |
| `algorithmVersion`  | string                 | Yes      | Version of the scoring algorithm that produced or last updated this profile.                            |
| `scores`            | record<string, number> | Yes      | Normalized score map for the specialty across algorithm dimensions.                                     |
| `confidence`        | number                 | Yes      | Confidence in the profile or match result, usually on a 0-1 or 0-100 scale depending on implementation. |
| `numberOfResidents` | number                 | No       | Number of resident data points used to estimate or validate the profile.                                |
| `updatedAt`         | timestamp              | Yes      | Timestamp of the last algorithm update.                                                                 |

## Recommended shape

```ts
type SpecialtyProfile = {
  specialtyId: string;
  algorithmVersion: string;
  scores: Record<string, number>;
  confidence: number;
  numberOfResidents?: number;
  updatedAt: Timestamp;
};
```

## Notes

- Keep `scores` aligned with the canonical attribute vocabulary in [attributes.md](attributes.md).
- Do not read algorithm values from the `specialties` collection.
- Use `algorithmVersion` whenever the scoring logic changes so historical profiles remain interpretable.
- Keep `confidence` numeric and consistent across the app, even if the display later formats it as a percentage.
