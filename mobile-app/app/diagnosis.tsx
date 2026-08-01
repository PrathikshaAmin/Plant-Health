import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config";

const AREAS = ["Leaf", "Stem", "Root", "Fruit", "Whole Plant"];
const SEVERITIES = ["Low", "Medium", "High"];

export default function Diagnosis() {
  const [step, setStep] = useState(1);

  const [affectedArea, setAffectedArea] = useState("");
  const [availableSymptoms, setAvailableSymptoms] = useState<any[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState("");

  const [result, setResult] = useState<any>(null);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // When area is selected, fetch matching symptoms for that area
  const fetchSymptomsForArea = async (area: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/symptoms?affectedArea=${area}`,
      );
      setAvailableSymptoms(response.data);
    } catch (err) {
      console.log("Error fetching symptoms:", err);
    }
  };

  const selectArea = (area: string) => {
    setAffectedArea(area);
    setSelectedSymptoms([]);
    fetchSymptomsForArea(area);
    setStep(2);
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const selectSeverity = (sev: string) => {
    setSeverity(sev);
    runDiagnosis(sev);
  };

  const runDiagnosis = async (sev: string) => {
    setLoading(true);
    setError("");
    setStep(4);
    try {
      const response = await axios.post(`${API_URL}/diagnosis/match`, {
        affectedArea,
        symptoms: selectedSymptoms,
        severity: sev,
      });
      setResult(response.data);

      // Fetch treatments for the matched disease
      const treatmentsRes = await axios.get(
        `${API_URL}/treatments?disease=${response.data.disease._id}`,
      );
      setTreatments(treatmentsRes.data);

      // Save this diagnosis to history
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        await axios.post(`${API_URL}/history`, {
          user: userId,
          symptomsSelected: selectedSymptoms,
          affectedArea,
          severity: sev,
          suggestedDisease: response.data.disease._id,
          matchScore: response.data.matchScore,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "No matching diagnosis found");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(1);
    setAffectedArea("");
    setSelectedSymptoms([]);
    setSeverity("");
    setResult(null);
    setTreatments([]);
    setError("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Diagnosis Wizard</Text>
      <Text style={styles.stepIndicator}>Step {step} of 4</Text>

      {step === 1 && (
        <View>
          <Text style={styles.question}>
            Which part of the plant is affected?
          </Text>
          {AREAS.map((area) => (
            <TouchableOpacity
              key={area}
              style={styles.optionButton}
              onPress={() => selectArea(area)}
            >
              <Text style={styles.optionText}>{area}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.question}>Select the symptoms you see:</Text>
          {availableSymptoms.length === 0 && (
            <Text style={styles.emptyText}>
              No symptoms found for this area yet.
            </Text>
          )}
          {availableSymptoms.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom._id);
            return (
              <TouchableOpacity
                key={symptom._id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => toggleSymptom(symptom._id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {isSelected ? "✓ " : ""}
                  {symptom.symptomName}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedSymptoms.length === 0 && styles.disabledButton,
            ]}
            onPress={() => selectedSymptoms.length > 0 && setStep(3)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.question}>How severe does it look?</Text>
          {SEVERITIES.map((sev) => (
            <TouchableOpacity
              key={sev}
              style={styles.optionButton}
              onPress={() => selectSeverity(sev)}
            >
              <Text style={styles.optionText}>{sev}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 4 && (
        <View>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#15803d"
              style={{ marginTop: 20 }}
            />
          )}

          {!loading && error !== "" && (
            <View style={styles.resultCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultDisease}>
                {result.disease.diseaseName}
              </Text>
              <Text style={styles.resultScore}>
                Match Score: {result.matchScore}%
              </Text>
              <Text style={styles.resultLabel}>Description:</Text>
              <Text style={styles.resultText}>
                {result.disease.description}
              </Text>

              {result.disease.preventionMethods && (
                <>
                  <Text style={styles.resultLabel}>Prevention:</Text>
                  <Text style={styles.resultText}>
                    {result.disease.preventionMethods}
                  </Text>
                </>
              )}

              {treatments.length > 0 && (
                <>
                  <Text style={styles.resultLabel}>
                    Recommended Treatments:
                  </Text>
                  {treatments.map((t) => (
                    <View key={t._id} style={styles.treatmentItem}>
                      <Text style={styles.treatmentName}>
                        {t.treatmentName} ({t.category})
                      </Text>
                      {t.dosage ? (
                        <Text style={styles.resultText}>
                          Dosage: {t.dosage}
                        </Text>
                      ) : null}
                      {t.applicationMethod ? (
                        <Text style={styles.resultText}>
                          {t.applicationMethod}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {!loading && (
            <TouchableOpacity style={styles.nextButton} onPress={restart}>
              <Text style={styles.nextButtonText}>Start New Diagnosis</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0fdf4",
    paddingTop: 60,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#166534" },
  stepIndicator: { fontSize: 13, color: "#6b7280", marginBottom: 20 },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  optionSelected: { backgroundColor: "#15803d", borderColor: "#15803d" },
  optionText: { fontSize: 15, color: "#374151" },
  optionTextSelected: { color: "white", fontWeight: "600" },
  nextButton: {
    backgroundColor: "#15803d",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  disabledButton: { backgroundColor: "#9ca3af" },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 10,
    marginTop: 10,
  },
  resultDisease: { fontSize: 20, fontWeight: "bold", color: "#166534" },
  resultScore: {
    fontSize: 15,
    color: "#15803d",
    fontWeight: "600",
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
  },
  resultText: { fontSize: 14, color: "#4b5563", marginTop: 2 },
  errorText: { fontSize: 15, color: "#dc2626", textAlign: "center" },
  emptyText: { fontSize: 13, color: "#9ca3af", marginBottom: 10 },
  treatmentItem: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  treatmentName: { fontSize: 14, fontWeight: "600", color: "#166534" },
});
