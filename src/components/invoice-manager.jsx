"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function InvoiceManager({
  title,
  description,
  fields,
  buttonText,
  onButtonClick,
}) {
  const [invoices, setInvoices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const addInvoice = async (invoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_API_KEY_HERE",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant that processes and validates invoice data.",
              },
              {
                role: "user",
                content: `Process and validate this invoice data: ${JSON.stringify(
                  invoiceData
                )}`,
              },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to process invoice");

      const result = await response.json();
      const processedInvoice = JSON.parse(result.choices[0].message.content);
      setInvoices((prevInvoices) => [...prevInvoices, processedInvoice]);
    } catch (err) {
      setError("Error processing invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const invoiceData = Object.fromEntries(formData.entries());
    addInvoice(invoiceData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-black max-w-md mx-auto">
      <h2 className="font-cabin text-black text-2xl mb-4">{title}</h2>
      <p className="font-cabin text-black mb-6">{description}</p>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="font-cabin text-black block mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}
        <Component3DButtonDesign type="submit" disabled={loading}>
          {loading ? "Processing..." : buttonText}
        </Component3DButtonDesign>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        <h3 className="font-cabin text-black text-xl mb-4">Recent Invoices</h3>
        {invoices.length > 0 ? (
          <ul className="space-y-2">
            {invoices.map((invoice, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded">
                <span className="font-bold">#{invoice.invoiceNumber}</span> - $
                {invoice.invoiceAmount}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No invoices added yet.</p>
        )}
      </div>
    </div>
  );
}

function InvoiceManagerStory() {
  const fields = [
    { label: "Invoice Number", type: "text", name: "invoiceNumber" },
    { label: "Invoice Amount", type: "number", name: "invoiceAmount" },
  ];

  return (
    <div className="p-4 bg-[#A0C0DE] min-h-screen">
      <InvoiceManager
        title="Invoicing"
        description="Manage your invoices"
        fields={fields}
        buttonText="Add Invoice"
        onButtonClick={() => {}}
      />
    </div>
  );
}

export default InvoiceManager;