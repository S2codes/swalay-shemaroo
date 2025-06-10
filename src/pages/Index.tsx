import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import axios from "axios";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to albums after 2 seconds for demo purposes
    const timer = setTimeout(() => {
      navigate("/albums");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center text-white">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Music className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">SwaLay Digital</h1>
        <p className="text-xl text-gray-300 mb-8">
          Professional Music Platform Dashboard
        </p>
        <div className="space-x-4">
          <Link to="/signin">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Sign In
            </Button>
          </Link>
          <Link to="/albums">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              View Albums
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Redirecting to albums in 2 seconds...
        </p>
      </div>
    </div>
  );
};

export default Index;
