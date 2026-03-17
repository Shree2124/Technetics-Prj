"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AddSchemePage() {
  const router = useRouter();
  const [schemeName, setSchemeName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const [maxIncome, setMaxIncome] = useState(1000000);
  const [ruralOnly, setRuralOnly] = useState(false);
  const [minFamilySize, setMinFamilySize] = useState(1);
  const [benefitAmount, setBenefitAmount] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const schemeData = {
      schemeName,
      category,
      description,
      eligibility: {
        minAge,
        maxAge,
        maxIncome,
        ruralOnly,
        minFamilySize,
      },
      benefitAmount,
    };

    try {
      await api.post("/api/schemes", schemeData);
      router.push("/dashboard"); // Redirect to a relevant page after success
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Scheme</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="schemeName"
            className="block text-sm font-medium text-gray-700"
          >
            Scheme Name
          </label>
          <input
            type="text"
            id="schemeName"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-800">
            Eligibility
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label
                htmlFor="minAge"
                className="block text-sm font-medium text-gray-700"
              >
                Min Age
              </label>
              <input
                type="number"
                id="minAge"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="maxAge"
                className="block text-sm font-medium text-gray-700"
              >
                Max Age
              </label>
              <input
                type="number"
                id="maxAge"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="maxIncome"
                className="block text-sm font-medium text-gray-700"
              >
                Max Income
              </label>
              <input
                type="number"
                id="maxIncome"
                value={maxIncome}
                onChange={(e) => setMaxIncome(Number(e.target.value))}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="minFamilySize"
                className="block text-sm font-medium text-gray-700"
              >
                Min Family Size
              </label>
              <input
                type="number"
                id="minFamilySize"
                value={minFamilySize}
                onChange={(e) => setMinFamilySize(Number(e.target.value))}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ruralOnly"
                checked={ruralOnly}
                onChange={(e) => setRuralOnly(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="ruralOnly"
                className="ml-2 block text-sm text-gray-900"
              >
                Rural Only
              </label>
            </div>
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="benefitAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Benefit Amount
          </label>
          <input
            type="number"
            id="benefitAmount"
            value={benefitAmount}
            onChange={(e) => setBenefitAmount(Number(e.target.value))}
            className="mt-1 block w-full"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Add Scheme"}
        </button>
      </form>
    </div>
  );
}
