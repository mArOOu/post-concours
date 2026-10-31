# Residency Attribute Source of Truth

This document defines the canonical attributes used by the residency matching algorithm.

Each attribute is scored on a 0-10 scale:

- `0` = very low / not important / strongly absent
- `5` = moderate or neutral
- `10` = very high / extremely important / strongly present

Use the same scale for both user preferences and specialty characteristics so they can be compared directly.

This file mirrors the editable `attributeDefinitions` collection in Firestore. Keep the repository copy and database copy aligned.

## Attribute catalog

| Name                           | Description                                                                                    | Scale | Type                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------- | ----- | ------------------------ |
| Lifestyle                      | How much the attribute affects day-to-day lifestyle stability, flexibility, and personal time. | 0-10  | Specialty characteristic |
| Stress                         | Expected overall psychological pressure and urgency in the specialty.                          | 0-10  | Specialty characteristic |
| Work Hours                     | Typical weekly hours, call burden, night shifts, and schedule intensity.                       | 0-10  | Specialty characteristic |
| Emergency Frequency            | How often urgent or acute cases are handled.                                                   | 0-10  | Specialty characteristic |
| Surgery                        | Degree to which the specialty centers on operative care.                                       | 0-10  | Specialty characteristic |
| Procedures                     | Level of hands-on clinical procedures performed routinely.                                     | 0-10  | Specialty characteristic |
| Diagnostics                    | Emphasis on evaluating symptoms, interpreting data, and reaching diagnoses.                    | 0-10  | Specialty characteristic |
| Manual Dexterity               | How much precise hand skill and fine motor control the specialty rewards.                      | 0-10  | Specialty characteristic |
| Anatomy                        | How strongly the specialty relies on detailed anatomical knowledge.                            | 0-10  | Specialty characteristic |
| Imaging                        | How central radiologic or image-based interpretation is to the specialty.                      | 0-10  | Specialty characteristic |
| Research                       | How important academic output, publications, and evidence generation are.                      | 0-10  | Specialty characteristic |
| Teaching                       | How much the specialty involves formal instruction and mentorship.                             | 0-10  | Specialty characteristic |
| Income Potential               | Typical earning potential relative to other specialties.                                       | 0-10  | Specialty characteristic |
| Private Practice               | How compatible the specialty is with private-sector practice.                                  | 0-10  | Specialty characteristic |
| Teamwork                       | How much success depends on working closely with a care team.                                  | 0-10  | Specialty characteristic |
| Leadership                     | How often the specialty requires coordinating people, services, or decisions.                  | 0-10  | Specialty characteristic |
| Communication                  | How heavily the specialty depends on patient, family, and interprofessional communication.     | 0-10  | Specialty characteristic |
| Pattern Recognition            | How much the specialty rewards spotting clinical patterns across cases.                        | 0-10  | Specialty characteristic |
| Patient Contact                | Amount of direct, repeated interaction with patients.                                          | 0-10  | Specialty characteristic |
| Long-Term Follow-up            | How much continuity of care and longitudinal follow-up are involved.                           | 0-10  | Specialty characteristic |
| Physical Demand                | Expected physical intensity, stamina requirements, and endurance demands.                      | 0-10  | Specialty characteristic |
| Mental Demand                  | Cognitive load, complexity, and sustained concentration required.                              | 0-10  | Specialty characteristic |
| Burnout Risk                   | Expected exposure to workload, emotional strain, and chronic fatigue pressure.                 | 0-10  | Specialty characteristic |
| Creativity                     | How much the student values flexible thinking, originality, and problem solving.               | 0-10  | User preference          |
| Adaptability                   | How much the student prefers fast-changing environments and varied cases.                      | 0-10  | User preference          |
| Independence                   | How much the student prefers autonomy and self-directed work.                                  | 0-10  | User preference          |
| Prestige                       | How important social status, recognition, or perceived competitiveness is to the student.      | 0-10  | User preference          |
| Competition Tolerance          | How comfortable the student is with competitive training and entry pathways.                   | 0-10  | User preference          |
| Procedural Interest            | How much the student enjoys performing procedures and working with their hands.                | 0-10  | User preference          |
| Surgical Interest              | How much the student prefers operative specialties and the surgical mindset.                   | 0-10  | User preference          |
| Diagnostic Interest            | How much the student enjoys solving diagnostic problems and uncertainty.                       | 0-10  | User preference          |
| Imaging Interest               | How much the student enjoys image interpretation and visual analysis.                          | 0-10  | User preference          |
| Research Interest              | How much the student wants research opportunities and academic work.                           | 0-10  | User preference          |
| Teaching Interest              | How much the student values mentoring, teaching, and academic communication.                   | 0-10  | User preference          |
| Income Preference              | How important earning potential is to the student.                                             | 0-10  | User preference          |
| Private Practice Preference    | How much the student wants a specialty that supports private practice.                         | 0-10  | User preference          |
| Team-Oriented Work Preference  | How much the student prefers collaborative, multidisciplinary work.                            | 0-10  | User preference          |
| Leadership Preference          | How much the student wants responsibility for coordination and leadership.                     | 0-10  | User preference          |
| Communication Preference       | How much the student enjoys patient counseling and frequent conversation.                      | 0-10  | User preference          |
| Pattern Recognition Preference | How much the student enjoys recognizing subtle patterns and clinical signals.                  | 0-10  | User preference          |
| Patient Contact Preference     | How much the student wants frequent direct contact with patients.                              | 0-10  | User preference          |
| Continuity Preference          | How much the student values long-term follow-up and ongoing relationships.                     | 0-10  | User preference          |
| Physical Tolerance             | How much the student is comfortable with physically demanding work.                            | 0-10  | User preference          |
| Mental Tolerance               | How much the student is comfortable with intense cognitive demands.                            | 0-10  | User preference          |
| Burnout Sensitivity            | How much the student wants to avoid burnout-prone environments.                                | 0-10  | User preference          |

## Usage notes

- Specialty characteristics describe the specialty profile itself.
- User preferences describe what the student values or wants.
- Matching should compare user preference scores to specialty characteristic scores on the same 0-10 axis.
- Keep names stable so questionnaire items, specialty profiles, and scoring logic all refer to the same attribute vocabulary.
- Add new attributes here first before wiring them into the questionnaire or scoring model.
