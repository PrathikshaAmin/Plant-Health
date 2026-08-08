# Dataset Sources

The disease, symptom, and diagnosis-rule reference data used to seed this
project (`backend/seed.js`) is grounded in the following public sources
rather than invented data.

## Primary dataset

- **PlantVillage Dataset** — the most widely cited public plant-disease
  image dataset, with ~38 disease/healthy classes across 14 crop species.
- **New Plant Diseases Dataset (Kaggle)** — an augmented version of
  PlantVillage, used to confirm disease/crop class names.
  https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset

All 12 diseases seeded into this project (Apple Scab, Apple Black Rot,
Cedar Apple Rust, Tomato Early Blight, Tomato Late Blight, Tomato Septoria
Leaf Spot, Tomato Yellow Leaf Curl Virus, Potato Late Blight, Corn Common
Rust, Corn Northern Leaf Blight, Grape Black Rot, and Citrus Greening) are
real classes drawn from these datasets.

## Supporting reference material

Descriptive text (causes, symptoms, prevention methods, and treatment
suggestions) was written from general plant pathology knowledge consistent
with:

- **CABI Plantwise Knowledge Bank** — https://plantwise.org/knowledgebank/
- **USDA / university extension guidance** on plant disease management

## How this data is used in the project

- `backend/seed.js` loads the diseases, symptoms, treatments, and
  diagnosis rules described here directly into MongoDB via the existing
  `Disease`, `Symptom`, `Treatment`, and `DiagnosisRule` Mongoose models.
- This gives the Disease Library, Diagnosis Wizard, and Treatment
  Recommendation modules real, dataset-grounded content to run against
  instead of empty collections.
- The rule-matching logic itself (`diagnosisController.js`) is *not*
  hardcoded — it scores any `DiagnosisRule` documents in the database
  against the user's selected symptoms, so admins can add further
  diseases/rules through the admin portal and the engine will use them
  the same way.
