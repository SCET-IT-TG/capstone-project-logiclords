export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border-l-4"
         style={{ borderColor: color }}>
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}