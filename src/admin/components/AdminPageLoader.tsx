function AdminPageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-400" />

        <p className="mt-4 text-sm font-medium text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default AdminPageLoader;
