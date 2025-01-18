"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function PayrollManager({ activeModule }) {
  const [employeeName, setEmployeeName] = React.useState("");
  const [salaryAmount, setSalaryAmount] = React.useState("");
  const [salaries, setSalaries] = React.useState([]);
  const [aiSuggestion, setAiSuggestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleAddSalary = async () => {
    if (employeeName && salaryAmount) {
      setLoading(true);
      try {
        const response = await fetch("https://api.openai.com/payroll/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer OPENAI_API_KEY",
          },
          body: JSON.stringify({ name: employeeName, amount: salaryAmount }),
        });

        if (!response.ok) throw new Error("Failed to process payroll");

        const data = await response.json();
        setSalaries([...salaries, data]);
        setAiSuggestion(data.aiSuggestion);
        setEmployeeName("");
        setSalaryAmount("");
      } catch (err) {
        setError(
          "An error occurred while processing the payroll. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={`p-6 space-y-4 ${
        activeModule === "payroll"
          ? "text-black bg-white"
          : "text-black bg-[#F5F5F5]"
      }`}
    >
      <h1 className="font-cabin text-2xl text-center">
        Manage your{" "}
        {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
      </h1>
      {activeModule === "payroll" && (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="font-cabin text-lg">Employee Name</label>
            <input
              name="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="border border-black p-2 rounded-[6px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-cabin text-lg">Salary Amount</label>
            <input
              name="salaryAmount"
              type="number"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
              className="border border-black p-2 rounded-[6px]"
            />
          </div>
          <Component3DButtonDesign onClick={handleAddSalary} disabled={loading}>
            {loading ? "Processing..." : "Add Salary"}
          </Component3DButtonDesign>
          {error && <p className="text-red-500 font-cabin">{error}</p>}
          {aiSuggestion && (
            <div className="bg-blue-100 p-4 rounded-[6px]">
              <h3 className="font-cabin text-lg mb-2">AI Suggestion:</h3>
              <p className="font-cabin">{aiSuggestion}</p>
            </div>
          )}
          <div className="mt-4">
            <h2 className="font-cabin text-xl mb-2">Salary List</h2>
            <ul className="list-disc list-inside">
              {salaries.map((salary, index) => (
                <li key={index} className="font-cabin">
                  {salary.name}: ${salary.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {activeModule !== "payroll" && (
        <p className="font-cabin text-center">
          Content for{" "}
          {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} is
          under development.
        </p>
      )}
    </div>
  );
}

function PayrollManagerStory() {
  return (
    <div>
      <PayrollManager activeModule="payroll" />
      <PayrollManager activeModule="benefits" />
    </div>
  );
}

export default PayrollManager;