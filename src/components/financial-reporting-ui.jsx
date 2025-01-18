"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function FinancialReportingUi({ title, description, reportTypes, onGenerate }) {
  const [selectedReport, setSelectedReport] = React.useState(reportTypes[0]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulating API call to ChatGPT for report generation
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
                role: "user",
                content: `Generate a ${selectedReport} report with real-time financial data.`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await response.json();
      const reportContent = data.choices[0].message.content;

      // Create PDF using jsPDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text(reportContent, 10, 10);
      doc.save(`${selectedReport.replace(/\s+/g, "_")}_Report.pdf`);

      onGenerate(selectedReport);
    } catch (err) {
      setError(
        "An error occurred while generating the report. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-black font-cabin">
      <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
      <p className="mb-4 text-black">{description}</p>
      <div className="mb-4">
        <label
          htmlFor="reportType"
          className="block font-medium mb-2 text-black"
        >
          Report Type
        </label>
        <select
          name="reportType"
          className="w-full border border-black rounded p-2"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          {reportTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <Component3DButtonDesign
        onClick={handleGenerateReport}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Report"}
      </Component3DButtonDesign>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

function FinancialReportingUiStory() {
  const handleGenerate = (reportType) => {
    console.log(`Generating ${reportType} report...`);
  };

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-8">
      <FinancialReportingUi
        title="Financial Reporting"
        description="Generate financial reports"
        reportTypes={["Balance Sheet", "Income Statement", "Cash Flow"]}
        onGenerate={handleGenerate}
      />
    </div>
  );
}

export default FinancialReportingUi;