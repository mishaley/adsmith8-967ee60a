
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const topNavItems = [
    { label: "HOME", path: "/home" },
    { label: "CAMPAIGNS", path: "/campaigns" },
  ];

  const bottomNavItems = [
    { label: "INTAKE", path: "/intake" },
    { label: "ORGANIZATIONS", path: "/organizations" },
    { label: "OFFERINGS", path: "/offerings" },
    { label: "PERSONAS", path: "/personas" },
    { label: "MESSAGES", path: "/messages" },
    { label: "IMAGES", path: "/images" },
    { label: "CAPTIONS", path: "/captions" },
    { label: "SETTINGS", path: "/settings" },
  ];

  const handleNewButtonClick = () => {
    navigate("/new");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top fixed items */}
      {topNavItems.map((item, index) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            item.label === "HOME" ? "h-[60px]" : "h-[50px]",
            "flex items-center pl-[18px] text-[16px]",
            index === 0 && "border-b border-white/20", // Only HOME gets bottom border
            currentPath === item.path && "bg-[#d3e4fd] text-[#0c343d] font-bold border-r-[#d3e4fd]"
          )}
        >
          {item.label}
        </Link>
      ))}

      {/* Flexible spacer with NEW button */}
      <div className="flex-grow border-b border-white/20 flex flex-col">
        <div className="flex justify-center pt-[5px]">
          <button
            className="w-[100px] h-[40px] rounded-full bg-[#ecb652] text-[16px] text-[#154851] font-bold border-2 border-white cursor-pointer"
            onClick={handleNewButtonClick}
          >
            NEW
          </button>
        </div>
      </div>

      {/* Bottom fixed items */}
      {bottomNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "h-[60px]", // Set all bottom items to 60px height
            "flex items-center pl-[18px] text-[16px] border-b border-white/20",
            currentPath === item.path && "bg-[#d3e4fd] text-[#0c343d] font-bold border-r-[#d3e4fd]"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default MainNav;
