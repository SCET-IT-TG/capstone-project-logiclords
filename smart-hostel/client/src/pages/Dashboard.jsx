import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <MainLayout>

      <h2 className="text-3xl font-bold mb-6">
        {user.role.toUpperCase()} Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">User ID</h3>
          <p className="text-xl mt-2">{user.userId}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Role</h3>
          <p className="text-xl mt-2 capitalize">{user.role}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Status</h3>
          <p className="text-green-600 text-xl mt-2">Active</p>
        </div>

      </div>

    </MainLayout>
  );
};

export default Dashboard;