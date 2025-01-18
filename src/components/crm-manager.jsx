"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function CrmManager({
  activeModule,
  onAddCustomer,
  onChangeName,
  onChangeEmail,
  customerName,
  customerEmail,
}) {
  return (
    <div>
      <div className="bg-[#A0C0DE] p-8 border border-black rounded-md w-full max-w-[600px]">
        <h2 className="text-black font-cabin text-xl mb-4">{activeModule}</h2>
        <p className="text-black font-cabin mb-4">Manage your customers</p>
        <div className="mb-4">
          <label
            className="block text-black font-cabin mb-1"
            htmlFor="customerName"
          >
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={customerName}
            onChange={onChangeName}
            className="border border-black w-full p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-black font-cabin mb-1"
            htmlFor="customerEmail"
          >
            Customer Email
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={customerEmail}
            onChange={onChangeEmail}
            className="border border-black w-full p-2 rounded"
          />
        </div>
        <Component3DButtonDesign onClick={onAddCustomer}>
          Add Customer
        </Component3DButtonDesign>
      </div>
    </div>
  );
}

function CrmManagerStory() {
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");

  const handleAddCustomer = async () => {
    const apiKey = "YOUR_API_KEY";
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Add new customer: Name - ${customerName}, Email - ${customerEmail}`,
        max_tokens: 50,
      }),
    });
    const data = await response.json();
    console.log("AI Response:", data.choices[0].text);
    console.log("Add Customer", customerName, customerEmail);
  };

  const handleNameChange = (e) => setCustomerName(e.target.value);
  const handleEmailChange = (e) => setCustomerEmail(e.target.value);

  return (
    <div className="p-8">
      <CrmManager
        activeModule="CRM"
        onAddCustomer={handleAddCustomer}
        onChangeName={handleNameChange}
        onChangeEmail={handleEmailChange}
        customerName={customerName}
        customerEmail={customerEmail}
      />
    </div>
  );
}

export default CrmManager;