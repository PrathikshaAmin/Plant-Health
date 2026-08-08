/**
 * seed.js
 *
 * Populates the database with dataset-backed reference data so the app
 * doesn't run on empty collections.
 *
 * Source basis: disease names and crop associations are drawn from real
 * classes in the PlantVillage dataset (~38 disease/healthy classes across
 * 14 crop species) and the Kaggle "New Plant Diseases Dataset" (augmented
 * PlantVillage). Descriptive text (causes, symptoms, prevention) is written
 * from general plant pathology knowledge consistent with sources like CABI
 * Plantwise and USDA extension guidance. See docs/DATASET_SOURCES.md.
 *
 * Usage:
 *   node seed.js          # wipes Disease/Symptom/Treatment/DiagnosisRule
 *                          # collections and reloads them from this file
 *   node seed.js --keep   # skip the wipe, just insert (will error on
 *                          # duplicate unique fields if already seeded)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Disease = require("./models/Disease");
const Symptom = require("./models/Symptom");
const Treatment = require("./models/Treatment");
const DiagnosisRule = require("./models/DiagnosisRule");

// ---------------------------------------------------------------------------
// 1. Diseases
// ---------------------------------------------------------------------------
const diseases = [
  {
    diseaseName: "Apple Scab",
    scientificName: "Venturia inaequalis",
    category: "Fungal",
    affectedArea: ["Leaf", "Fruit"],
    description:
      "One of the most common apple diseases, causing olive-green to black scabby lesions on leaves and fruit.",
    symptoms:
      "Olive-green velvety spots on leaves, dark scabby lesions on fruit surface, premature leaf drop.",
    causes: "Fungal spores spread by rain splash in cool, wet spring weather.",
    preventionMethods:
      "Rake and destroy fallen leaves, prune for airflow, use resistant apple varieties.",
  },
  {
    diseaseName: "Apple Black Rot",
    scientificName: "Botryosphaeria obtusa",
    category: "Fungal",
    affectedArea: ["Fruit", "Leaf"],
    description:
      "Causes fruit rot and leaf spot, often entering through wounds or dead wood.",
    symptoms:
      'Purple-bordered leaf spots ("frogeye leaf spot"), concentric rings of rot on fruit.',
    causes:
      "Fungus overwinters in dead wood/mummified fruit; spreads via spores in wet conditions.",
    preventionMethods:
      "Remove dead/infected wood and mummified fruit, prune for airflow.",
  },
  {
    diseaseName: "Cedar Apple Rust",
    scientificName: "Gymnosporangium juniperi-virginianae",
    category: "Fungal",
    affectedArea: ["Leaf", "Fruit"],
    description:
      "Requires both apple and cedar/juniper trees to complete its life cycle.",
    symptoms:
      "Bright orange-yellow spots on leaves, tube-like structures on the underside.",
    causes:
      "Fungal spores travel between cedar and apple trees, spread by wind.",
    preventionMethods:
      "Remove nearby cedar/juniper hosts where feasible, plant resistant apple varieties.",
  },
  {
    diseaseName: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    category: "Fungal",
    affectedArea: ["Leaf", "Stem"],
    description:
      "Common fungal disease affecting lower/older leaves first, with target-like lesions.",
    symptoms:
      "Dark brown spots with concentric rings, yellowing around lesions.",
    causes:
      "Warm, humid conditions; spreads via water splash and infected debris.",
    preventionMethods:
      "Mulch to reduce soil splash, avoid overhead watering, rotate crops.",
  },
  {
    diseaseName: "Tomato Late Blight",
    scientificName: "Phytophthora infestans",
    category: "Fungal",
    affectedArea: ["Leaf", "Stem", "Fruit"],
    description:
      "A fast-spreading, historically devastating disease (cause of the Irish potato famine pathogen family).",
    symptoms:
      "Water-soaked gray-green spots that rapidly turn brown/black, white fuzzy growth on leaf undersides in humid conditions.",
    causes: "Cool, wet weather; spreads rapidly via windborne spores.",
    preventionMethods:
      "Avoid overhead watering, ensure good spacing/airflow, remove infected plants immediately.",
  },
  {
    diseaseName: "Tomato Septoria Leaf Spot",
    scientificName: "Septoria lycopersici",
    category: "Fungal",
    affectedArea: ["Leaf"],
    description:
      "Causes numerous small spots, typically starting on lower leaves.",
    symptoms:
      "Small circular spots with dark borders and gray/tan centers, tiny black specks within spots.",
    causes: "Warm, wet, humid conditions; spreads via splashing water.",
    preventionMethods:
      "Mulch, avoid overhead watering, remove lower infected leaves promptly.",
  },
  {
    diseaseName: "Tomato Yellow Leaf Curl Virus",
    scientificName: "TYLCV",
    category: "Viral",
    affectedArea: ["Leaf", "Whole Plant"],
    description:
      "A viral disease transmitted by whiteflies, causing severe stunting and yield loss.",
    symptoms:
      "Upward curling and yellowing of leaves, stunted growth, reduced fruit set.",
    causes: "Spread exclusively by whitefly (Bemisia tabaci) feeding.",
    preventionMethods:
      "Control whitefly populations, use resistant varieties, remove infected plants.",
  },
  {
    diseaseName: "Potato Late Blight",
    scientificName: "Phytophthora infestans",
    category: "Fungal",
    affectedArea: ["Leaf", "Whole Plant"],
    description:
      "Same pathogen family as tomato late blight; can destroy a crop within days in favorable conditions.",
    symptoms:
      "Dark water-soaked lesions on leaves, white mold on undersides, rapid plant collapse.",
    causes: "Cool, wet weather; airborne and soil-borne spread.",
    preventionMethods:
      "Use certified disease-free seed potatoes, avoid overhead irrigation, ensure good drainage.",
  },
  {
    diseaseName: "Corn Common Rust",
    scientificName: "Puccinia sorghi",
    category: "Fungal",
    affectedArea: ["Leaf"],
    description:
      "A widespread fungal disease producing rust-colored pustules on leaves.",
    symptoms:
      "Small cinnamon-brown raised pustules scattered across both leaf surfaces.",
    causes: "Cool, moist conditions; windborne spores.",
    preventionMethods:
      "Plant resistant hybrids, avoid dense planting for better airflow.",
  },
  {
    diseaseName: "Corn Northern Leaf Blight",
    scientificName: "Exserohilum turcicum",
    category: "Fungal",
    affectedArea: ["Leaf"],
    description:
      "Causes large cigar-shaped lesions, can significantly reduce yield if severe.",
    symptoms: "Long, elliptical gray-green to tan lesions on leaves.",
    causes:
      "Moderate temperatures with high humidity or extended leaf wetness.",
    preventionMethods: "Crop rotation, resistant hybrids, residue management.",
  },
  {
    diseaseName: "Grape Black Rot",
    scientificName: "Guignardia bidwellii",
    category: "Fungal",
    affectedArea: ["Leaf", "Fruit"],
    description:
      'A major grape disease causing fruit to shrivel into hard black "mummies."',
    symptoms:
      "Reddish-brown circular leaf spots, fruit rot turning berries into shriveled black mummies.",
    causes:
      "Warm, wet spring/summer weather; spores from previous season's mummified fruit.",
    preventionMethods:
      "Remove mummified fruit and infected debris, prune for airflow.",
  },
  {
    diseaseName: "Citrus Greening (Huanglongbing)",
    scientificName: "Candidatus Liberibacter spp.",
    category: "Bacterial",
    affectedArea: ["Leaf", "Whole Plant", "Fruit"],
    description:
      "One of the most destructive citrus diseases worldwide, spread by the Asian citrus psyllid.",
    symptoms:
      "Blotchy yellow mottling on leaves (asymmetric across the midrib), stunted growth, bitter/lopsided fruit.",
    causes: "Spread by psyllid insect vector; no cure once infected.",
    preventionMethods:
      "Control psyllid populations, use certified disease-free nursery stock, remove infected trees promptly.",
  },
];

// ---------------------------------------------------------------------------
// 2. Symptoms
// ---------------------------------------------------------------------------
const symptoms = [
  { symptomName: "Yellowing", affectedArea: "Leaf" },
  { symptomName: "Leaf curling", affectedArea: "Leaf" },
  { symptomName: "Spots with concentric rings", affectedArea: "Leaf" },
  { symptomName: "Dark/black lesions", affectedArea: "Fruit" },
  { symptomName: "White fuzzy growth", affectedArea: "Leaf" },
  { symptomName: "Wilting", affectedArea: "Whole Plant" },
  { symptomName: "Stunted growth", affectedArea: "Whole Plant" },
  { symptomName: "Orange/rust pustules", affectedArea: "Leaf" },
  { symptomName: "Fruit shriveling", affectedArea: "Fruit" },
  { symptomName: "Blotchy mottling", affectedArea: "Leaf" },
];

// ---------------------------------------------------------------------------
// 3. Treatments (Chemical/Organic/Biological suggestions per disease)
// ---------------------------------------------------------------------------
// diseaseName here is only used to look up the _id after diseases are
// inserted — it is not a field on the Treatment schema itself.
const treatments = [
  {
    diseaseName: "Apple Scab",
    treatmentName: "Captan or Myclobutanil Fungicide",
    category: "Chemical",
    description: "Foliar fungicide spray to control scab lesions.",
    applicationMethod: "Spray on leaves and fruit per label instructions.",
  },
  {
    diseaseName: "Apple Scab",
    treatmentName: "Sulfur Spray",
    category: "Organic",
    description: "Sulfur-based organic fungicide.",
    applicationMethod:
      "Spray during wet spring weather at first sign of infection.",
  },
  {
    diseaseName: "Apple Black Rot",
    treatmentName: "Captan-based Fungicide",
    category: "Chemical",
    description: "Controls fruit rot and leaf spot.",
    applicationMethod: "Apply as a foliar spray per label instructions.",
  },
  {
    diseaseName: "Apple Black Rot",
    treatmentName: "Sanitation Pruning",
    category: "Organic",
    description:
      "Removal of dead wood and mummified fruit to cut the infection cycle.",
    applicationMethod:
      "Prune and destroy infected material during dormant season.",
  },
  {
    diseaseName: "Cedar Apple Rust",
    treatmentName: "Myclobutanil Fungicide",
    category: "Chemical",
    description: "Controls rust infection on apple foliage.",
    applicationMethod: "Spray at bud break and repeat per label instructions.",
  },
  {
    diseaseName: "Cedar Apple Rust",
    treatmentName: "Gall Removal from Host Junipers",
    category: "Organic",
    description: "Removes the alternate host stage of the fungus.",
    applicationMethod: "Manually remove galls from nearby cedar/juniper trees.",
  },
  {
    diseaseName: "Tomato Early Blight",
    treatmentName: "Chlorothalonil Fungicide",
    category: "Chemical",
    description: "Broad-spectrum fungicide for early blight control.",
    applicationMethod: "Spray on foliage at first sign of lesions.",
  },
  {
    diseaseName: "Tomato Early Blight",
    treatmentName: "Copper Spray",
    category: "Organic",
    description: "Copper-based fungicide.",
    applicationMethod: "Apply as a preventive foliar spray.",
  },
  {
    diseaseName: "Tomato Late Blight",
    treatmentName: "Copper-based Fungicide (Preventive)",
    category: "Chemical",
    description: "Preventive fungicide application before infection sets in.",
    applicationMethod:
      "Spray on a preventive schedule during cool, wet periods.",
  },
  {
    diseaseName: "Tomato Late Blight",
    treatmentName: "Prompt Removal of Infected Material",
    category: "Organic",
    description: "Removing infected plant matter to stop spore spread.",
    applicationMethod: "Remove and destroy infected plants/leaves immediately.",
  },
  {
    diseaseName: "Tomato Septoria Leaf Spot",
    treatmentName: "Chlorothalonil Fungicide",
    category: "Chemical",
    description: "Controls leaf spot lesions.",
    applicationMethod: "Spray on foliage per label instructions.",
  },
  {
    diseaseName: "Tomato Septoria Leaf Spot",
    treatmentName: "Copper Spray + Crop Rotation",
    category: "Organic",
    description: "Combines a copper spray with rotation to reduce reinfection.",
    applicationMethod: "Spray foliage and rotate crop location each season.",
  },
  {
    diseaseName: "Tomato Yellow Leaf Curl Virus",
    treatmentName: "Whitefly Predators / Insecticidal Soap",
    category: "Biological",
    description:
      "Controls the whitefly vector that spreads the virus. No cure once infected — remove and destroy infected plants.",
    applicationMethod:
      "Release/attract natural predators or apply insecticidal soap to control whiteflies.",
  },
  {
    diseaseName: "Potato Late Blight",
    treatmentName: "Copper or Mancozeb Fungicide",
    category: "Chemical",
    description: "Controls late blight lesions on foliage.",
    applicationMethod:
      "Spray on a preventive/curative schedule per label instructions.",
  },
  {
    diseaseName: "Potato Late Blight",
    treatmentName: "Destroy Infected Foliage Immediately",
    category: "Organic",
    description: "Rapid removal of infected foliage to limit spread.",
    applicationMethod:
      "Remove and destroy affected foliage as soon as symptoms appear.",
  },
  {
    diseaseName: "Corn Common Rust",
    treatmentName: "Foliar Fungicide (if severe)",
    category: "Chemical",
    description: "Applied only when rust pressure is high.",
    applicationMethod: "Spray foliage when pustule coverage is significant.",
  },
  {
    diseaseName: "Corn Common Rust",
    treatmentName: "Resistant Variety Selection",
    category: "Organic",
    description: "Planting resistant hybrids to avoid the need for treatment.",
    applicationMethod: "Select resistant hybrid seed for future plantings.",
  },
  {
    diseaseName: "Corn Northern Leaf Blight",
    treatmentName: "Foliar Fungicide",
    category: "Chemical",
    description: "Controls lesion spread on leaves.",
    applicationMethod: "Spray foliage per label instructions.",
  },
  {
    diseaseName: "Corn Northern Leaf Blight",
    treatmentName: "Crop Rotation and Residue Removal",
    category: "Organic",
    description: "Reduces the amount of overwintering inoculum in the field.",
    applicationMethod: "Rotate crops and remove/bury residue after harvest.",
  },
  {
    diseaseName: "Grape Black Rot",
    treatmentName: "Mancozeb or Myclobutanil Fungicide",
    category: "Chemical",
    description: "Controls fruit rot and leaf spot.",
    applicationMethod:
      "Spray on a protective schedule through the growing season.",
  },
  {
    diseaseName: "Grape Black Rot",
    treatmentName: "Sanitation",
    category: "Organic",
    description: "Removing mummified fruit and infected debris.",
    applicationMethod:
      "Remove and destroy mummified fruit and infected debris.",
  },
  {
    diseaseName: "Citrus Greening (Huanglongbing)",
    treatmentName: "Psyllid Control (Predatory Insects)",
    category: "Biological",
    description:
      "Controls the psyllid vector that spreads the disease. No cure once infected — removal of infected trees protects healthy ones.",
    applicationMethod:
      "Introduce/support predatory insects that target the Asian citrus psyllid.",
  },
];

// ---------------------------------------------------------------------------
// 4. Diagnosis Rules (used by the rule-matching engine)
// ---------------------------------------------------------------------------
// symptomNames/diseaseName are resolved to ObjectIds after insertion.
const diagnosisRules = [
  {
    affectedArea: "Leaf",
    symptomNames: ["Spots with concentric rings", "Yellowing"],
    severity: "Medium",
    diseaseName: "Tomato Early Blight",
    matchScore: 80,
  },
  {
    affectedArea: "Leaf",
    symptomNames: ["White fuzzy growth", "Wilting"],
    severity: "High",
    diseaseName: "Tomato Late Blight",
    matchScore: 85,
  },
  {
    affectedArea: "Leaf",
    symptomNames: ["Leaf curling", "Stunted growth"],
    severity: "High",
    diseaseName: "Tomato Yellow Leaf Curl Virus",
    matchScore: 80,
  },
  {
    affectedArea: "Leaf",
    symptomNames: ["Orange/rust pustules"],
    severity: "Low",
    diseaseName: "Corn Common Rust",
    matchScore: 75,
  },
  {
    affectedArea: "Fruit",
    symptomNames: ["Fruit shriveling", "Dark/black lesions"],
    severity: "High",
    diseaseName: "Grape Black Rot",
    matchScore: 80,
  },
  {
    affectedArea: "Leaf",
    symptomNames: ["Blotchy mottling", "Stunted growth"],
    severity: "High",
    diseaseName: "Citrus Greening (Huanglongbing)",
    matchScore: 85,
  },
];

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------
async function seed() {
  await connectDB();

  const keepExisting = process.argv.includes("--keep");

  if (!keepExisting) {
    console.log(
      "Clearing existing Disease/Symptom/Treatment/DiagnosisRule collections...",
    );
    await Promise.all([
      Disease.deleteMany({}),
      Symptom.deleteMany({}),
      Treatment.deleteMany({}),
      DiagnosisRule.deleteMany({}),
    ]);
  }

  console.log(`Inserting ${diseases.length} diseases...`);
  const insertedDiseases = await Disease.insertMany(diseases);
  const diseaseIdByName = Object.fromEntries(
    insertedDiseases.map((d) => [d.diseaseName, d._id]),
  );

  console.log(`Inserting ${symptoms.length} symptoms...`);
  const insertedSymptoms = await Symptom.insertMany(symptoms);
  const symptomIdByName = Object.fromEntries(
    insertedSymptoms.map((s) => [s.symptomName, s._id]),
  );

  console.log(`Inserting ${treatments.length} treatments...`);
  const treatmentsToInsert = treatments.map(({ diseaseName, ...rest }) => {
    const diseaseId = diseaseIdByName[diseaseName];
    if (!diseaseId) {
      throw new Error(`Treatment references unknown disease: ${diseaseName}`);
    }
    return { ...rest, disease: diseaseId };
  });
  await Treatment.insertMany(treatmentsToInsert);

  console.log(`Inserting ${diagnosisRules.length} diagnosis rules...`);
  const rulesToInsert = diagnosisRules.map(
    ({ symptomNames, diseaseName, ...rest }) => {
      const diseaseId = diseaseIdByName[diseaseName];
      if (!diseaseId) {
        throw new Error(`Rule references unknown disease: ${diseaseName}`);
      }
      const symptomIds = symptomNames.map((name) => {
        const id = symptomIdByName[name];
        if (!id) {
          throw new Error(`Rule references unknown symptom: ${name}`);
        }
        return id;
      });
      return { ...rest, disease: diseaseId, symptoms: symptomIds };
    },
  );
  await DiagnosisRule.insertMany(rulesToInsert);

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
