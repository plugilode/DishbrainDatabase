"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function TaxCalculationModule({ title }) {
  const [taxType, setTaxType] = React.useState("Income Tax");
  const [amount, setAmount] = React.useState("");
  const [currency, setCurrency] = React.useState("Dollars");
  const [result, setResult] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const formattedTitle = title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const calculateTax = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_OPENAI_API_KEY",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a tax calculation assistant. Calculate the tax based on the given information and provide a recommendation.",
              },
              {
                role: "user",
                content: `Calculate ${taxType} for ${amount} ${currency}. Provide the tax amount and a recommendation.`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to calculate tax");
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setResult(aiResponse);
    } catch (err) {
      setError(
        "An error occurred while calculating the tax. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-black max-w-md w-full">
      <h3 className="text-3xl font-bold mb-6">{formattedTitle}</h3>
      <p className="mb-4 font-cabin">Calculate your taxes</p>
      <select
        name="taxType"
        className="w-full p-3 mb-4 border border-black rounded font-cabin"
        value={taxType}
        onChange={(e) => setTaxType(e.target.value)}
      >
        <option value="Income Tax">Income Tax</option>
        <option value="Sales Tax">Sales Tax</option>
        <option value="GST Tax">GST Tax</option>
      </select>
      <input
        type="number"
        name="amount"
        placeholder="Enter amount"
        className="w-full p-3 mb-4 border border-black rounded font-cabin"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        name="currency"
        className="w-full p-3 mb-4 border border-black rounded font-cabin"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="Dollars">Dollars</option>
        <option value="Rupees">Rupees</option>
        <option value="Euros">Euros</option>
      </select>
      <Component3DButtonDesign onClick={calculateTax} disabled={loading}>
        {loading ? "Calculating..." : "Calculate Tax"}
      </Component3DButtonDesign>
      {error && <div className="mt-4 text-red-500 font-cabin">{error}</div>}
      {result && (
        <div className="mt-4 font-bold whitespace-pre-line font-cabin">
          {result}
        </div>
      )}
    </div>
  );
}

function TaxCalculationModuleStory() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center p-4">
      <TaxCalculationModule title="Tax Calculation" />
    </div>
  );
}

export default TaxCalculationModule;