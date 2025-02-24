
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const topNavItems = [
    { label: "HOME", path: "/home" },
    { label: "CAMPAIGNS", path: "/campaigns" },
  ];

  const bottomNavItems = [
    { label: "ORGANIZATIONS", path: "/organizations" },
    { label: "OFFERINGS", path: "/offerings" },
    { label: "PERSONAS", path: "/personas" },
    { label: "MESSAGES", path: "/messages" },
    { label: "IMAGES", path: "/images" },
    { label: "CAPTIONS", path: "/captions" },
    { label: "SETTINGS", path: "/settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Top fixed items */}
      {topNavItems.map((item, index) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "h-[50px] flex items-center pl-[18px]",
            index === 0 && "border-b border-white/20", // Only HOME gets bottom border
            currentPath === item.path && "bg-[#d3e4fd] text-[#0c343d] font-bold border-r-[#d3e4fd]"
          )}
        >
          {item.label}
        </Link>
      ))}

      {/* Flexible spacer */}
      <div className="flex-grow border-b border-white/20" />

      {/* Bottom fixed items */}
      {bottomNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "h-[50px] flex items-center pl-[18px] border-b border-white/20",
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
