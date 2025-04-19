import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Loader from "@/components/Loader";
import { RootState } from "@/redux/store";

const AuthLayout = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  // console.log(user)
console.log(location)
  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email"
  ].includes(location.pathname)
  
  console.log(isAuthPage)
  console.log(user&&'true')
  if (loading) {
    return <Loader />; // Show a loading state instead of redirecting
  }
  // 🛑 Redirect unauthenticated users away from protected pages
  if (!user && !isAuthPage && !loading) {
    console.log("user not found",user)
    return <Navigate to="/login" />
  }

  if (user && isAuthPage) {
    return <Navigate to="/dashboard/media" replace />;
  }

  // If authenticated and authorized, render the nested routes
  return <Outlet />;
};

export default AuthLayout;
