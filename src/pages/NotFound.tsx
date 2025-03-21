
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white bg-mesh-pattern p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md text-center animate-scale-in">
        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-wolf-primary to-wolf-secondary bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-gray-600 mb-6">الصفحة غير موجودة</p>
        <p className="text-gray-500 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Button asChild className="gap-2">
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>العودة للصفحة الرئيسية</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
