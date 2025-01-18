"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function EmployeeManagementInterface({
  employeeName,
  setEmployeeName,
  designation,
  setDesignation,
  onAddEmployee,
}) {
  return (
    <div className="bg-white p-8 border border-black">
      <div className="mb-4">
        <label
          className="block font-cabin text-black mb-2"
          htmlFor="employeeName"
        >
          Employee Name
        </label>
        <input
          type="text"
          id="employeeName"
          name="employeeName"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="w-full border border-black py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label
          className="block font-cabin text-black mb-2"
          htmlFor="designation"
        >
          Designation
        </label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full border border-black py-2 px-3"
        />
      </div>
      <Component3DButtonDesign onClick={onAddEmployee}>
        Add Employee
      </Component3DButtonDesign>
      <HrModule text="AI Integration, Real-Time Data Processing, Advanced Security Measures" />
    </div>
  );
}

function EmployeeManagementInterfaceStory() {
  const [employeeName, setEmployeeName] = React.useState("");
  const [designation, setDesignation] = React.useState("");

  const handleAddEmployee = async () => {
    console.log("Add Employee:", { employeeName, designation });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are adding a new employee in HR system.",
          },
          {
            role: "user",
            content: `Add employee with name ${employeeName} and designation ${designation}`,
          },
        ],
      }),
    });
    const data = await response.json();
    console.log("ChatGPT Response:", data);
  };

  return (
    <div>
      <EmployeeManagementInterface
        employeeName={employeeName}
        setEmployeeName={setEmployeeName}
        designation={designation}
        setDesignation={setDesignation}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
}

export default EmployeeManagementInterface;