const Navbar = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center text-inndigo font-black text-xl">
          <img className="w-5 mr-2" src="/innatical.svg" alt="Innatical Logo" />
          Cloud
        </div>
  
        <div className="flex gap-5">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#partners">Partners</a>
        </div>
  
        <a
          className="rounded-full bg-inndigo text-white px-5 py-2"
          href="https://dashboard.innatical.cloud"
        >
          Dashboard
        </a>
      </div>
    );
  };
  
  export default Navbar;
  