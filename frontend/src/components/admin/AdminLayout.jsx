import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
