"use client";
import React from "react";

function MeasurementUnitSelector({ name }) {
  return (
    <select name={name} className="border border-black rounded py-2 px-3">
      <option value="kg">kg</option>
      <option value="lb">lb</option>
      <option value="litre">Litre</option>
      <option value="pcs">pcs</option>
    </select>
  );
}

function MeasurementUnitSelectorStory() {
  return (
    <div className="p-4">
      <MeasurementUnitSelector name="unitOfMeasurement" />
    </div>
  );
}

export default MeasurementUnitSelector;