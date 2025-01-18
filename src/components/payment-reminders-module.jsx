"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function PaymentRemindersModule({ title }) {
  const [reminderName, setReminderName] = React.useState("");
  const [reminderDate, setReminderDate] = React.useState("");
  const [reminders, setReminders] = React.useState([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [aiSuggestion, setAiSuggestion] = React.useState("");

  const processChatGPTRequest = async (prompt) => {
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
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );
      const data = await response.json();
      setAiSuggestion(data.choices[0].message.content);
    } catch (error) {
      console.error("Error processing AI request:", error);
      setAiSuggestion("Failed to get AI suggestion. Please try again.");
    }
    setIsProcessing(false);
  };

  const onAddReminder = () => {
    if (reminderName && reminderDate) {
      const newReminder = {
        name: reminderName,
        date: reminderDate,
        id: Date.now(),
      };
      setReminders((prevReminders) => [...prevReminders, newReminder]);
      setReminderName("");
      setReminderDate("");

      // AI automation: Set up recurring reminders and get AI suggestion
      const currentDate = new Date(reminderDate);
      const futureDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
      const automatedReminder = {
        name: `${reminderName} (Automated)`,
        date: futureDate.toISOString().split("T")[0],
        id: Date.now() + 1,
      };
      setReminders((prevReminders) => [...prevReminders, automatedReminder]);

      // Get AI suggestion for optimizing payment schedule
      processChatGPTRequest(
        `Based on the payment reminder "${reminderName}" set for ${reminderDate}, suggest an optimized payment schedule for the next year.`
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-black w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 uppercase">{title}</h3>
      <div className="mb-4">
        <label
          className="block text-black font-cabin mb-2"
          htmlFor="reminderName"
        >
          Reminder Name
        </label>
        <input
          className="w-full p-2 border border-black rounded"
          type="text"
          id="reminderName"
          name="reminderName"
          value={reminderName}
          onChange={(e) => setReminderName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-black font-cabin mb-2"
          htmlFor="reminderDate"
        >
          Reminder Date
        </label>
        <input
          className="w-full p-2 border border-black rounded"
          type="date"
          id="reminderDate"
          name="reminderDate"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <Component3DButtonDesign onClick={onAddReminder}>
          Add Reminder
        </Component3DButtonDesign>
      </div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Reminders:</h4>
        <ul className="list-disc pl-5">
          {reminders.map((reminder) => (
            <li key={reminder.id} className="mb-1">
              {reminder.name} - {reminder.date}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="text-lg font-semibold mb-2">AI Suggestion:</h4>
        {isProcessing ? (
          <p>Processing AI suggestion...</p>
        ) : (
          <p>
            {aiSuggestion || "Add a reminder to get an AI-powered suggestion."}
          </p>
        )}
      </div>
    </div>
  );
}

function PaymentRemindersModuleStory() {
  return (
    <div className="p-8 space-y-6 bg-[#F5F5F5] flex justify-center items-center min-h-screen">
      <PaymentRemindersModule title="Payment Reminders Module" />
    </div>
  );
}

export default PaymentRemindersModule;