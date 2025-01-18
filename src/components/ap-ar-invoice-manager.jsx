"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function ApArInvoiceManager({
  title,
  description,
  invoiceNumber,
  invoiceAmount,
  onAddInvoice,
}) {
  const [invoiceData, setInvoiceData] = React.useState({
    number: invoiceNumber,
    amount: invoiceAmount,
  });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [aiSuggestion, setAiSuggestion] = React.useState("");

  const handleInputChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const processInvoice = async () => {
    setIsProcessing(true);
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
                role: "user",
                content: `Analyze this invoice: Number ${invoiceData.number}, Amount ${invoiceData.amount}`,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      setAiSuggestion(data.choices[0].message.content);
    } catch (error) {
      console.error("Error processing invoice:", error);
    }
    setIsProcessing(false);
  };

  const handleAddInvoice = () => {
    processInvoice();
    onAddInvoice(invoiceData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-black">
      <h3 className="font-cabin text-black mb-4">{title}</h3>
      <p className="font-cabin text-black mb-6">{description}</p>
      <div className="mb-4">
        <label
          className="font-cabin text-black block mb-2"
          htmlFor="invoiceNumber"
        >
          Invoice Number
        </label>
        <input
          type="text"
          id="invoiceNumber"
          name="number"
          className="w-full p-2 border border-black rounded"
          value={invoiceData.number}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="font-cabin text-black block mb-2"
          htmlFor="invoiceAmount"
        >
          Invoice Amount
        </label>
        <input
          type="text"
          id="invoiceAmount"
          name="amount"
          className="w-full p-2 border border-black rounded"
          value={invoiceData.amount}
          onChange={handleInputChange}
        />
      </div>
      <Component3DButtonDesign
        onClick={handleAddInvoice}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Add Invoice"}
      </Component3DButtonDesign>
      {aiSuggestion && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h4 className="font-cabin text-black mb-2">AI Suggestion:</h4>
          <p className="font-cabin text-black">{aiSuggestion}</p>
        </div>
      )}
    </div>
  );
}

function ApArInvoiceManagerStory() {
  const [invoices, setInvoices] = React.useState([]);

  const addInvoice = (invoice) => {
    setInvoices([...invoices, invoice]);
  };

  return (
    <div className="space-y-6 p-8">
      <ApArInvoiceManager
        title="Accounts Payable"
        description="Manage your accounts payable seamlessly"
        invoiceNumber=""
        invoiceAmount=""
        onAddInvoice={(invoice) => {
          console.log("Adding Invoice in Accounts Payable", invoice);
          addInvoice({ ...invoice, type: "payable" });
        }}
      />
      <ApArInvoiceManager
        title="Accounts Receivable"
        description="Manage your accounts receivable efficiently"
        invoiceNumber=""
        invoiceAmount=""
        onAddInvoice={(invoice) => {
          console.log("Adding Invoice in Accounts Receivable", invoice);
          addInvoice({ ...invoice, type: "receivable" });
        }}
      />
      <div className="mt-8">
        <h3 className="font-cabin text-black mb-4">Added Invoices</h3>
        <ul className="list-disc pl-5">
          {invoices.map((invoice, index) => (
            <li key={index} className="font-cabin text-black">
              {invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)} -
              Number: {invoice.number}, Amount: {invoice.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ApArInvoiceManager;