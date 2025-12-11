import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLoginMutation } from "@/redux/features/adminApi";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await adminLogin(data).unwrap();
      localStorage.setItem("adminToken", result.data.token);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-zinc-400 mt-2">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#d4af37] focus:ring-[#d4af37]"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#d4af37] focus:ring-[#d4af37]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d4af37] hover:bg-[#b8962f] text-black font-semibold h-11"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-zinc-400 mt-6">
            Don't have an account?{" "}
            <Link to="/admin/register" className="text-[#d4af37] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
