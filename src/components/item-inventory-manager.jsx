"use client";
import React from "react";
import MeasurementUnitSelector from "../components/measurement-unit-selector";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function ItemInventoryManager({ activeModule }) {
  return (
    <div className="flex flex-col items-start bg-[#F5F5F5] p-8 space-y-4 border border-black w-full md:w-[400px]">
      <h2 className="font-cabin text-black">Manage your inventory</h2>

      <form className="flex flex-col space-y-2 w-full">
        <label className="font-cabin text-black" htmlFor="itemName">
          Item Name
        </label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          className="border border-black rounded py-2 px-3"
        />

        <label className="font-cabin text-black" htmlFor="itemQuantity">
          Item Quantity
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="itemQuantity"
            name="itemQuantity"
            className="border border-black rounded py-2 px-3 flex-grow mr-2"
          />
          <MeasurementUnitSelector name="unitOfMeasurement" />
        </div>

        <Component3DButtonDesign
          onClick={() => console.log("Add item button clicked")}
        >
          Add Item
        </Component3DButtonDesign>
      </form>

      <style jsx global>{`
        /* Add additional styles if needed */
      `}</style>
      <script src="https://example.com/chat-gpt-api.js"></script>
      <script>{`
        // AI integration logic with chat-gpt-api
        function integrateAI() {
          // AI logic here
        }
        
        integrateAI();
      `}</script>
    </div>
  );
}

function ItemInventoryManagerStory() {
  return (
    <div className="p-8 flex flex-col space-y-8 bg-[#F5F5F5]">
      <ItemInventoryManager activeModule="Inventory" />
    </div>
  );
}

export default ItemInventoryManager;