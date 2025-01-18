"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function SupplyChainManager({ moduleName, onAddSupplier }) {
  const [supplierName, setSupplierName] = React.useState("");
  const [supplierContact, setSupplierContact] = React.useState("");
  const convertedName =
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  const handleAddSupplier = () => {
    if (supplierName && supplierContact) {
      onAddSupplier({ name: supplierName, contact: supplierContact });
      setSupplierName("");
      setSupplierContact("");
    }
  };

  return (
    <div className="bg-white p-6 border border-black w-full md:w-[400px] rounded-lg mb-8">
      <h2 className="font-cabin text-black text-center text-xl mb-6">
        {convertedName}
      </h2>

      <div className="flex flex-col space-y-4">
        <input
          type="text"
          name="supplierName"
          placeholder="Supplier Name"
          className="border border-black p-2 rounded"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />
        <input
          type="text"
          name="supplierContact"
          placeholder="Supplier Contact"
          className="border border-black p-2 rounded"
          value={supplierContact}
          onChange={(e) => setSupplierContact(e.target.value)}
        />
        <Component3DButtonDesign onClick={handleAddSupplier}>
          Add Supplier
        </Component3DButtonDesign>
      </div>
    </div>
  );
}

function SupplyChainManagerStory() {
  const [suppliers, setSuppliers] = React.useState([]);

  const handleAddSupplier = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
    console.log("New supplier added:", newSupplier);
  };

  return (
    <div className="p-6 space-y-8 bg-[#F5F5F5] min-h-screen flex flex-col items-center">
      <SupplyChainManager
        moduleName="supply chain"
        onAddSupplier={handleAddSupplier}
      />
      <div className="w-full md:w-[400px] bg-white p-6 border border-black rounded-lg">
        <h3 className="font-cabin text-black text-center text-lg mb-4">
          Supplier List
        </h3>
        {suppliers.length > 0 ? (
          <ul className="space-y-2">
            {suppliers.map((supplier, index) => (
              <li key={index} className="border border-black p-2 rounded">
                <p className="font-cabin text-black">
                  <strong>Name:</strong> {supplier.name}
                </p>
                <p className="font-cabin text-black">
                  <strong>Contact:</strong> {supplier.contact}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-cabin text-black text-center">
            No suppliers added yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default SupplyChainManager;