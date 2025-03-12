import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Loader from "@/components/Loader";
import { RootState } from "@/redux/store";

const AuthLayout = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <Loader />; // Show a loading state instead of redirecting
  }

  if (!user && !loading) {
    console.log("user not found", user);
    return <Navigate to="/login" />;
  }

  // If authenticated and authorized, render the nested routes
  return <Outlet />;
};

export default AuthLayout;
