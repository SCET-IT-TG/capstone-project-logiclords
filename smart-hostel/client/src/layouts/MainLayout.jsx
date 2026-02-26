import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
};

export default MainLayout;