"use client";
import React from "react";

function Component3DButtonDesign({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-cabin text-black bg-[#F2C894] rounded-[6px] py-6 px-8 border border-black relative overflow-hidden"
      style={{
        boxShadow:
          "inset 0 -4px 0 rgba(0,0,0,0.2), inset 0 4px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "inset 0 -4px 0 rgba(0,0,0,0.2), inset 0 4px 0 rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "inset 0 -4px 0 rgba(0,0,0,0.2), inset 0 4px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1)";
      }}
    >
      {children}
    </button>
  );
}

function Component3DButtonDesignStory() {
  return (
    <div className="p-8 flex flex-col items-start space-y-4">
      <Component3DButtonDesign onClick={() => console.log("Button clicked")}>
        Click me
      </Component3DButtonDesign>
      <Component3DButtonDesign
        onClick={() => console.log("Another button clicked")}
      >
        Another button
      </Component3DButtonDesign>
    </div>
  );
}

export default Component3DButtonDesign;