export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-gray-600 mt-2">You don’t have access to this page.</p>
      </div>
    </div>
  );
}