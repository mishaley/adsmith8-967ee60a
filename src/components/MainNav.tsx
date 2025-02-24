
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "HOME", path: "/home" },
    { label: "CAMPAIGNS", path: "/campaigns" },
    { label: "ORGANIZATIONS", path: "/organizations" },
    { label: "OFFERINGS", path: "/offerings" },
    { label: "PERSONAS", path: "/personas" },
    { label: "MESSAGES", path: "/messages" },
    { label: "IMAGES", path: "/images" },
    { label: "CAPTIONS", path: "/captions" },
    { label: "SETTINGS", path: "/settings" },
  ];

  return (
    <nav className="flex flex-col h-full">
      {navItems.map((item, index) => {
        const isActive = currentPath === item.path;
        const isBeforeSpacer = index === 1; // CAMPAIGNS
        const isAfterSpacer = index === 2; // ORGANIZATIONS

        return (
          <div key={item.path}>
            <Link
              to={item.path}
              className={cn(
                "h-[50px] flex items-center pl-[18px] border-b border-white/20",
                isActive && "bg-[#d3e4fd] text-[#0c343d] font-bold border-r-[#d3e4fd]"
              )}
            >
              {item.label}
            </Link>
            {isBeforeSpacer && (
              <>
                <div className="flex flex-col items-center">
                  <button className="my-[5px] w-[100px] h-[40px] rounded-full bg-[#ecb652] text-[#154851] font-bold border-2 border-white">
                    NEW
                  </button>
                </div>
                <div className="flex-grow border-b border-white/20" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default MainNav;
