import ProjectSidebar from "../../../../components/ProjectSidebar";

const Apps = () => {
  return (
    <div className="flex min-h-screen">
      <ProjectSidebar />
      <div className="p-5 flex flex-col flex-1 divide-y-[0.75px] divide-neutral-700">
        <div className="px-5 py-3 bg-neutral-800 flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>

          <div>
            <p className="font-bold">Website</p>
            <p className="text-xs text-neutral-400">Uber • 10 Replicas</p>
          </div>
        </div>
        <div className="px-5 py-3 bg-neutral-800 flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>

          <div>
            <p className="font-bold">Website</p>
            <p className="text-xs text-neutral-400">Uber • 10 Replicas</p>
          </div>
        </div>
        <div className="px-5 py-3 bg-neutral-800 flex items-center gap-5 first:rounded-t-lg last:rounded-b-lg">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>

          <div>
            <p className="font-bold">Website</p>
            <p className="text-xs text-neutral-400">Uber • 10 Replicas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps;
