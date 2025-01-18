"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function PaymentGatewayManager({
  gateways = [],
  onAddGateway,
  chatGptIntegration,
}) {
  const [newGatewayName, setNewGatewayName] = React.useState("");
  const [newGatewayApiKey, setNewGatewayApiKey] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (chatGptIntegration) {
      await chatGptIntegration(newGatewayName);
    }

    onAddGateway({ name: newGatewayName, apiKey: newGatewayApiKey });

    setNewGatewayName("");
    setNewGatewayApiKey("");
  };

  return (
    <div className="font-cabin bg-white p-6 rounded-lg shadow-md border border-black">
      <h2 className="text-2xl font-bold mb-4">Payment Gateways</h2>
      <p className="mb-4">Manage your payment gateways</p>

      {gateways.length > 0 ? (
        <ul className="mb-6">
          {gateways.map((gateway, index) => (
            <li
              key={index}
              className="mb-2 p-2 bg-gray-100 rounded border border-black"
            >
              <strong>{gateway.name}</strong>: {gateway.apiKey}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 italic">No gateways added yet.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gatewayName" className="block mb-1">
            Gateway Name
          </label>
          <input
            type="text"
            id="gatewayName"
            name="gatewayName"
            value={newGatewayName}
            onChange={(e) => setNewGatewayName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="gatewayApiKey" className="block mb-1">
            Gateway API Key
          </label>
          <input
            type="text"
            id="gatewayApiKey"
            name="gatewayApiKey"
            value={newGatewayApiKey}
            onChange={(e) => setNewGatewayApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <Component3DButtonDesign type="submit">
          Add Gateway
        </Component3DButtonDesign>
      </form>

      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p className="text-yellow-800">
          This module is currently in development and not yet available for use.
        </p>
      </div>
    </div>
  );
}

function PaymentGatewayManagerStory() {
  const [gateways, setGateways] = React.useState([]);

  const handleAddGateway = (newGateway) => {
    setGateways([...gateways, newGateway]);
  };

  const chatGptIntegration = async (text) => {
    const response = await fetch("https://api.example.com/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({ query: text }),
    });
    const data = await response.json();
    console.log("ChatGPT response:", data);
  };

  return (
    <div className="p-8 bg-[#A0C0DE] min-h-screen">
      <PaymentGatewayManager
        gateways={gateways}
        onAddGateway={handleAddGateway}
        chatGptIntegration={chatGptIntegration}
      />
    </div>
  );
}

export default PaymentGatewayManager;