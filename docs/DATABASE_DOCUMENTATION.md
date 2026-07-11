# Database Documentation — Plant Health Diagnosis System

Database: MongoDB (Atlas cloud-hosted)

## Collections

### User
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| mobileNumber | String | required, unique |
| email | String | required, unique |
| password | String | required, stored as bcrypt hash |
| createdAt / updatedAt | Date | auto-generated |

### Disease
| Field | Type | Notes |
|---|---|---|
| diseaseName | String | required |
| scientificName | String | optional |
| category | String | required (e.g. Fungal, Bacterial, Viral, Pest) |
| affectedArea | [String] | required, enum: Leaf, Stem, Root, Fruit, Whole Plant |
| description | String | required |
| symptoms | String | optional |
| causes | String | optional |
| preventionMethods | String | optional |

### Symptom
| Field | Type | Notes |
|---|---|---|
| symptomName | String | required, unique |
| description | String | optional |
| affectedArea | String | required, enum: Leaf, Stem, Root, Fruit, Whole Plant |

### Treatment
| Field | Type | Notes |
|---|---|---|
| treatmentName | String | required |
| category | String | required, enum: Chemical, Organic, Biological |
| description | String | optional |
| dosage | String | optional |
| applicationMethod | String | optional |
| disease | ObjectId | required, references Disease |

### DiagnosisRule
| Field | Type | Notes |
|---|---|---|
| affectedArea | String | required, enum: Leaf, Stem, Root, Fruit, Whole Plant |
| symptoms | [ObjectId] | required, references Symptom |
| severity | String | required, enum: Low, Medium, High |
| disease | ObjectId | required, references Disease |
| matchScore | Number | required, 0–100 |

### DiagnosisHistory
| Field | Type | Notes |
|---|---|---|
| user | ObjectId | required, references User |
| symptomsSelected | [ObjectId] | required, references Symptom |
| affectedArea | String | required, enum: Leaf, Stem, Root, Fruit, Whole Plant |
| severity | String | required, enum: Low, Medium, High |
| suggestedDisease | ObjectId | required, references Disease |
| matchScore | Number | required |
| createdAt | Date | acts as diagnosis date |

### UploadedImage
| Field | Type | Notes |
|---|---|---|
| user | ObjectId | required, references User |
| imageUrl | String | required |
| originalFileName | String | optional |
| fileSize | Number | optional, in bytes |
| relatedDiagnosis | ObjectId | optional, references DiagnosisHistory |

## Relationships Summary
- Treatment → Disease (many-to-one)
- DiagnosisRule → Symptom (many-to-many), DiagnosisRule → Disease (many-to-one)
- DiagnosisHistory → User, Symptom, Disease
- UploadedImage → User, optionally DiagnosisHistory
