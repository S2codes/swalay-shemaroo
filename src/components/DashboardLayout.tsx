import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Album, File } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Albums", href: "/albums", icon: Album },
    { name: "Live Albums", href: "/live-albums", icon: Music },
    { name: "Rejected Albums", href: "/rejected-albums", icon: File },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("swalay_auth");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/albums" className="flex items-center gap-2">
              <img src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay-logo.png" alt="swalay" width={100} />
              </Link>
              <nav className="hidden md:flex space-x-4 ml-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  let activeBg = "bg-purple-100 text-purple-700";
                  if (item.name === "Live Albums") activeBg = "bg-green-100 text-green-700";
                  if (item.name === "Rejected Albums") activeBg = "bg-red-100 text-red-700";

                  let inactiveText = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";
                  if (item.name === "Live Albums") inactiveText = "text-green-700 hover:bg-green-50";
                  if (item.name === "Rejected Albums") inactiveText = "text-red-700 hover:bg-red-50";

                  const isActive = location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? activeBg : inactiveText
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
