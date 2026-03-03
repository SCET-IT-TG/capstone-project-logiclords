export default function QRCard({ qr }) {
  return (
    <div className="bg-white p-4 shadow rounded">
      <img src={qr} alt="QR Code" />
    </div>
  );
}