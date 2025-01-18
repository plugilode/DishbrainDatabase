"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function ProjectManager({
  projectName,
  deadline,
  onProjectNameChange,
  onDeadlineChange,
  onAddProject,
}) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-black">
      <h2 className="font-cabin text-black text-2xl mb-4">
        Manage your projects
      </h2>
      <div className="mb-4">
        <label
          htmlFor="projectName"
          className="block font-cabin text-black mb-2"
        >
          Project Name
        </label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          value={projectName}
          onChange={onProjectNameChange}
          className="w-full px-3 py-2 border border-black rounded-md font-cabin"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="deadline" className="block font-cabin text-black mb-2">
          Project Deadline (dd-mm-yyyy)
        </label>
        <div className="flex items-center">
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={deadline}
            onChange={onDeadlineChange}
            className="w-full px-3 py-2 border border-black rounded-md font-cabin"
          />
          <button className="ml-2 px-2 py-2 bg-gray-200 rounded-md">
            <i className="fas fa-calendar-alt"></i>
          </button>
        </div>
      </div>
      <div className="mt-6">
        <Component3DButtonDesign onClick={onAddProject}>
          Add Project
        </Component3DButtonDesign>
      </div>
    </div>
  );
}

function ProjectManagerStory() {
  const [projectName, setProjectName] = React.useState("");
  const [deadline, setDeadline] = React.useState("");

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleAddProject = () => {
    console.log("Add project button clicked");
    console.log("Project Name:", projectName);
    console.log("Deadline:", deadline);
    // Integrate with API here
  };

  return (
    <div className="bg-[#F5F5F5] p-8">
      <ProjectManager
        projectName={projectName}
        deadline={deadline}
        onProjectNameChange={handleProjectNameChange}
        onDeadlineChange={handleDeadlineChange}
        onAddProject={handleAddProject}
      />
    </div>
  );
}

export default ProjectManager;