import ProjectSidebar from "../../../../components/ProjectSidebar";

const Settings = () => {
  return (
    <div className="flex min-h-screen">
      <ProjectSidebar />
      <div className="flex flex-col gap-3 flex-1 p-5">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-xl">Settings</h1>
          <div className="flex flex-col">
            <label className="text-sm text-bold mb-1">Project Name</label>
            <input
              type="text"
              value="Testing"
              className="bg-neutral-800 block border border-neutral-700 rounded-md py-2 px-3 shadow-sm focus:outline-none max-w-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
