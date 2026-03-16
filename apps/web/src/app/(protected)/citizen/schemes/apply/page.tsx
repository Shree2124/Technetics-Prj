"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  FileText,
  User,
  Save,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const steps = [
  "Personal Details",
  "Documents",
  "AI Analysis & Review",
  "Submit",
];

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const schemeName = searchParams.get("name") || "Unknown Scheme";
  const schemeId = searchParams.get("id") || "0";

  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [scheme, setScheme] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [aiResults, setAiResults] = useState<any>(null);

  const [form, setForm] = useState({
    fullName: "",
    aadhaarNumber: "",
    phone: "",
    age: "",
    gender: "",
    address: {
      state: "",
      district: "",
      village: "",
      pincode: "",
    },
    ruralFlag: false,
    income: "",
    employmentStatus: "",
    educationLevel: "",
    familySize: "",
    healthCondition: false,
    disability: false,
    propertyOwned: "",
    bankAccount: "",
    housing_type: "",
    disaster_risk: "",
    declaration: false,
  });

  // Load draft and scheme data on mount
  useEffect(() => {
    loadScheme();
    loadDraft();
  }, [schemeId]);

  const loadScheme = async () => {
    try {
      const response = await api.get(`/api/citizen/schemes`);
      const schemes = response.data.schemes;
      const currentScheme =
        schemes.eligible?.find((s: any) => s._id === schemeId) ||
        schemes.ineligible?.find((s: any) => s._id === schemeId) ||
        schemes.applied?.find((s: any) => s._id === schemeId);

      if (currentScheme) {
        setScheme(currentScheme);
      }
    } catch (err) {
      console.error("Error loading scheme:", err);
    }
  };

  const loadDraft = async () => {
    try {
      const response = await api.get(
        `/api/citizen/application/draft?schemeId=${schemeId}`,
      );
      if (response.data.draft) {
        setForm(response.data.draft.draftData);
        setDraftSaved(true);
      }
    } catch (err) {
      // No draft found, that's okay
    }
  };

  const saveDraft = async () => {
    try {
      setError("");
      await api.post("/api/citizen/application/draft", {
        schemeId,
        draftData: form,
      });
      setDraftSaved(true);
      setSuccess("Draft saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save draft");
    }
  };

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDraftSaved(false);
  };

  const updateAddress = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    setDraftSaved(false);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    try {
      const response = await api.post("/api/citizen/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedFiles((prev) => [...prev, response.data.document]);
      setSuccess(`${documentType} uploaded successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = async (documentId: string) => {
    try {
      await api.delete(`/api/citizen/upload?documentId=${documentId}`);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== documentId));
      setSuccess("Document removed successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove document");
    }
  };

  const validateForm = () => {
    if (
      !form.fullName ||
      !form.aadhaarNumber ||
      !form.phone ||
      !form.age ||
      !form.gender
    ) {
      setError("Please fill all required personal details");
      return false;
    }

    if (
      !form.address.state ||
      !form.address.district ||
      !form.address.village ||
      !form.address.pincode
    ) {
      setError("Please fill all address fields");
      return false;
    }

    if (uploadedFiles.length === 0) {
      setError("Please upload at least one document");
      return false;
    }

    if (!form.declaration) {
      setError("Please accept the declaration");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/citizen/application/submit", {
        schemeId,
        applicationData: form,
        documents: uploadedFiles.map((f) => f.id),
      });

      setSubmitted(true);
      setSuccess("Application submitted successfully!");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(err.response?.data?.message || "Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      // Validate personal details
      if (
        !form.fullName ||
        !form.aadhaarNumber ||
        !form.phone ||
        !form.age ||
        !form.gender
      ) {
        setError("Please fill all required personal details");
        return;
      }
    }

    // AI Analysis Step
    if (currentStep === 1) {
      // Moving from Documents to AI Analysis
      setLoading(true);
      setError("");
      try {
        const aiData = {
          income: parseFloat(form.income) || 0,
          employment_status: form.employmentStatus || "unemployed",
          family_size: parseInt(form.familySize) || 1,
          education_level: form.educationLevel || "primary",
          health_condition: form.healthCondition ? 1 : 0,
          housing_type: form.housing_type || "temporary",
          disaster_risk: form.disaster_risk || "low",
        };

        const response = await api.post("/api/citizen/ai-analysis", aiData);
        setAiResults(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to get AI analysis.");
        setLoading(false);
        return; // Stop if AI analysis fails
      }
      setLoading(false);
    }

    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gov-dark-blue mb-2">
          Application Submitted!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Your application for <strong>{schemeName}</strong> has been submitted
          successfully. You can track its status from your applications page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/citizen/applications"
            className="rounded-lg bg-gov-dark-blue px-6 py-2.5 text-sm font-medium text-white hover:bg-gov-dark-blue/90 transition-colors"
          >
            View My Applications
          </Link>
          <Link
            href="/citizen/schemes"
            className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse More Schemes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/citizen/schemes"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gov-dark-blue mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Schemes
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue">
          Apply: {schemeName}
        </h1>
        {scheme && !scheme.isEligible && (
          <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  You may not be eligible for this scheme
                </p>
                <ul className="text-xs text-amber-700 mt-1 list-disc list-inside">
                  {scheme.eligibilityReasons?.map(
                    (reason: string, i: number) => (
                      <li key={i}>{reason}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex-1 flex items-center gap-2">
            <div
              className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= currentStep
                  ? "bg-gov-dark-blue text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${i <= currentStep ? "text-gov-dark-blue" : "text-gray-400"}`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 rounded ${i < currentStep ? "bg-gov-dark-blue" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Draft Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveDraft}
          disabled={loading || draftSaved}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="h-4 w-4" />
          {draftSaved ? "Draft Saved" : "Save Draft"}
        </button>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4 text-gov-dark-blue">
              <User className="h-5 w-5" />
              <h2 className="text-base font-semibold">
                Personal & Financial Details
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateForm("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Aadhaar Number *
                </label>
                <input
                  type="text"
                  value={form.aadhaarNumber}
                  onChange={(e) => updateForm("aadhaarNumber", e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength={12}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Age *
                </label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => updateForm("age", e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Gender *
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => updateForm("gender", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Annual Income (₹)
                </label>
                <input
                  type="number"
                  value={form.income}
                  onChange={(e) => updateForm("income", e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Family Size
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.familySize}
                  onChange={(e) => updateForm("familySize", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Employment Status
                </label>
                <select
                  value={form.employmentStatus}
                  onChange={(e) =>
                    updateForm("employmentStatus", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Housing Type
                </label>
                <select
                  value={form.housing_type}
                  onChange={(e) => updateForm("housing_type", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                >
                  <option value="">Select Housing Type</option>
                  <option value="owned">Owned</option>
                  <option value="rented">Rented</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                  Disaster Risk Area
                </label>
                <select
                  value={form.disaster_risk}
                  onChange={(e) => updateForm("disaster_risk", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                >
                  <option value="">Select Disaster Risk</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Address Fields */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gov-dark-blue mb-3">
                Address Details *
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.address.state}
                    onChange={(e) => updateAddress("state", e.target.value)}
                    placeholder="Enter state"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                    District
                  </label>
                  <input
                    type="text"
                    value={form.address.district}
                    onChange={(e) => updateAddress("district", e.target.value)}
                    placeholder="Enter district"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                    Village/City
                  </label>
                  <input
                    type="text"
                    value={form.address.village}
                    onChange={(e) => updateAddress("village", e.target.value)}
                    placeholder="Enter village or city"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={form.address.pincode}
                    onChange={(e) => updateAddress("pincode", e.target.value)}
                    placeholder="Enter pincode"
                    maxLength={6}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.ruralFlag}
                    onChange={(e) => updateForm("ruralFlag", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gov-dark-blue focus:ring-gov-mid-blue"
                  />
                  <span className="text-sm text-gray-700">Rural Area</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4 text-gov-dark-blue">
              <Upload className="h-5 w-5" />
              <h2 className="text-base font-semibold">Required Documents</h2>
            </div>
            <p className="text-sm text-gray-500">
              Upload documents in PDF, JPG, or PNG format (Max size: 5MB)
            </p>

            <div className="space-y-4">
              {[
                { key: "aadhaar", label: "Aadhaar Card", required: true },
                {
                  key: "income_certificate",
                  label: "Income Certificate",
                  required: false,
                },
                { key: "ration_card", label: "Ration Card", required: false },
                {
                  key: "property_document",
                  label: "Property Document",
                  required: false,
                },
                {
                  key: "medical_certificate",
                  label: "Medical Certificate",
                  required: false,
                },
              ].map(({ key, label, required }) => (
                <div
                  key={key}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                      </span>
                    </div>
                    {uploadedFiles.find((f) => f.documentType === key) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600">Uploaded</span>
                        <button
                          onClick={() =>
                            removeFile(
                              uploadedFiles.find((f) => f.documentType === key)
                                ?.id || "",
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, key)}
                          className="hidden"
                          disabled={loading}
                        />
                        <span className="text-xs text-gov-mid-blue hover:text-gov-dark-blue font-medium">
                          Choose File
                        </span>
                      </label>
                    )}
                  </div>
                  {uploadedFiles.find((f) => f.documentType === key) && (
                    <div className="text-xs text-gray-500">
                      Uploaded:{" "}
                      {new Date(
                        uploadedFiles.find((f) => f.documentType === key)
                          ?.uploadedAt || "",
                      ).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && aiResults && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4 text-gov-dark-blue">
              <CheckCircle className="h-5 w-5" />
              <h2 className="text-base font-semibold">AI Analysis & Review</h2>
            </div>

            {/* Vulnerability Score */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gov-dark-blue mb-2">
                Vulnerability Score
              </h3>
              <p className="text-2xl font-bold text-gov-dark-blue">
                {aiResults.vulnerability.vulnerability_score.toFixed(2)}
              </p>
              <p
                className={`text-sm font-medium ${aiResults.vulnerability.priority_level === "high" ? "text-red-600" : aiResults.vulnerability.priority_level === "medium" ? "text-amber-600" : "text-green-600"}`}
              >
                Priority Level: {aiResults.vulnerability.priority_level}
              </p>
            </div>

            {/* Fraud Detection */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gov-dark-blue mb-2">
                Fraud Risk
              </h3>
              <p
                className={`text-2xl font-bold ${aiResults.fraud.fraud_score > 0.5 ? "text-red-600" : "text-green-600"}`}
              >
                {aiResults.fraud.fraud_score > 0.5 ? "High Risk" : "Low Risk"}
              </p>
              {aiResults.fraud.reasons.length > 0 && (
                <ul className="text-xs text-red-700 mt-1 list-disc list-inside">
                  {aiResults.fraud.reasons.map((reason: string, i: number) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Scheme Recommendations */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gov-dark-blue mb-2">
                Recommended Schemes
              </h3>
              <div className="space-y-2">
                {aiResults.recommendations.map((rec: any) => (
                  <div
                    key={rec.scheme_id}
                    className="p-2 border-b border-gray-200"
                  >
                    <p className="font-medium text-sm">{rec.scheme_name}</p>
                    <p className="text-xs text-green-600">
                      Matching Score: {rec.matching_score}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4 text-gov-dark-blue">
              <CheckCircle className="h-5 w-5" />
              <h2 className="text-base font-semibold">
                Review Your Application
              </h2>
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Scheme</span>
                <span className="font-medium text-gov-dark-blue">
                  {schemeName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium">{form.fullName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Aadhaar</span>
                <span className="font-medium">{form.aadhaarNumber || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{form.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Age</span>
                <span className="font-medium">{form.age || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium">{form.gender || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Annual Income</span>
                <span className="font-medium">₹{form.income || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Family Size</span>
                <span className="font-medium">{form.familySize || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-right max-w-[50%]">
                  {[
                    form.address.village,
                    form.address.district,
                    form.address.state,
                    form.address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-gray-500 block mb-1">Documents</span>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file) => (
                    <span
                      key={file.id}
                      className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    >
                      {file.documentType.replace("_", " ")}
                    </span>
                  ))}
                  {uploadedFiles.length === 0 && (
                    <span className="text-gray-400 text-xs">
                      No documents uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-gov-mid-blue/20 bg-gov-light-blue/10 px-4 py-3">
              <input
                type="checkbox"
                checked={form.declaration}
                onChange={(e) => updateForm("declaration", e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded border-gray-300 text-gov-dark-blue focus:ring-gov-mid-blue"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                I hereby declare that the information provided is true and
                correct to the best of my knowledge. I understand that any
                misrepresentation may lead to rejection of my application.
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-gov-dark-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-gov-dark-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Next"}{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.declaration || loading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle className="h-4 w-4" />{" "}
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
