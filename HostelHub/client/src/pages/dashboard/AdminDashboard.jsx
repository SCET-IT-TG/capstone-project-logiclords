import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

export default function AdminDashboard() {

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <StatCard title="Students" value="120" color="#6366f1"/>
        <StatCard title="Wardens" value="5" color="#22c55e"/>
        <StatCard title="Rooms" value="40" color="#f97316"/>
        <StatCard title="Entries Today" value="85" color="#ec4899"/>

      </div>

    </DashboardLayout>
  );
}