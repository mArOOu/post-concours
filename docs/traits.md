# Trait Source of Truth

Traits are the intermediate layer between questionnaire answers and the attribute model.

Questions should map to traits first, and traits should map to the normalized attributes in [attributes.md](attributes.md).

## Trait catalog

| Trait                                    | Description                                                                                                 | Affected Attributes                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Procedural Interest                      | Enjoys performing hands-on procedures and working with active clinical tasks.                               | Surgery, Procedures, Manual Dexterity                          |
| Surgical Orientation                     | Prefers operative work, operating-room environments, and surgical decision-making.                          | Surgery, Manual Dexterity, Physical Demand, Leadership         |
| Diagnostic Reasoning                     | Enjoys solving uncertainty, narrowing diagnoses, and building clinical logic.                               | Diagnostics, Pattern Recognition, Mental Demand                |
| Imaging Orientation                      | Likes image-based interpretation and visual analysis.                                                       | Imaging, Diagnostics, Pattern Recognition                      |
| Patient Relationship Orientation         | Values repeated contact with patients and continuity over time.                                             | Patient Contact, Long-Term Follow-up, Communication            |
| Communication Load                       | Handles frequent conversations with patients, families, and teams.                                          | Communication, Patient Contact, Teamwork                       |
| Workload Intensity                       | Tolerates long hours, frequent calls, weekends, and sustained pace.                                         | Work Hours, Stress, Burnout Risk, Physical Demand              |
| Emergency Intensity                      | Works well in urgent, high-pressure, unpredictable situations.                                              | Emergency Frequency, Stress, Mental Demand                     |
| Stress Tolerance                         | Remains effective when the environment is demanding or emotionally intense.                                 | Stress, Burnout Risk, Mental Demand                            |
| Physical Endurance                       | Is comfortable with standing, moving, lifting, and physically demanding work.                               | Physical Demand, Work Hours, Surgery, Procedures               |
| Mental Endurance                         | Can sustain concentration, memory, and decision-making for long periods.                                    | Mental Demand, Diagnostics, Pattern Recognition                |
| Academic Orientation                     | Values teaching, research, mentorship, and university-linked work.                                          | Research, Teaching, Leadership                                 |
| Career and Income Orientation            | Cares about earning potential and the shape of future job opportunities.                                    | Income Potential, Private Practice, Leadership                 |
| Practice Independence                    | Prefers autonomy, self-direction, and the ability to work independently.                                    | Independence, Private Practice, Leadership                     |
| Team Orientation                         | Enjoys multidisciplinary work, coordination, and shared responsibility.                                     | Teamwork, Communication, Leadership                            |
| Competitiveness and Prestige Orientation | Is motivated by status, competitive environments, and selective pathways.                                   | Prestige, Competition Tolerance, Income Potential              |
| Adaptability to Resource Constraints     | Can work effectively despite changing systems, limited equipment, or varied settings.                       | Adaptability, Creativity, Independence                         |
| Lifestyle Stability Preference           | Wants predictable schedules, manageable fatigue, and a lower-disruption lifestyle.                          | Lifestyle, Work Hours, Burnout Risk, Adaptability              |
| Administrative Tolerance                 | Accepts paperwork, bureaucracy, and non-clinical workload without losing motivation.                        | Mental Demand, Burnout Risk, Leadership                        |
| Regional Opportunity Fit                 | Is shaped by where training and practice are available across Algeria.                                      | Private Practice, Income Potential, Independence, Adaptability |
| Decision-Making Confidence               | Likes being decisive and comfortable making choices under pressure.                                         | Mental Demand, Leadership, Pattern Recognition                 |
| Personality Style                        | Captures how interpersonal style affects specialty fit, such as introversion, calmness, or competitiveness. | Communication, Teamwork, Independence, Leadership              |
| Innovation and Technology Orientation    | Enjoys new tools, workflow improvements, and modern clinical methods.                                       | Creativity, Adaptability, Research, Imaging, Diagnostics       |

## Usage notes

- A single question can map to more than one trait.
- A single trait can contribute to more than one attribute.
- Keep the trait names stable so resident answers, student answers, and scoring logic all point to the same intermediate vocabulary.
- If a new question is added later, define its trait here before wiring it into the scoring model.
