import { Link } from "react-router";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container flex h-[calc(100vh-65px)] w-full flex-col items-center justify-center px-4 mx-auto">
      <div className="w-full space-y-6 max-w-md">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-gray-100 p-2">
            <img
              src="/placeholder.svg?height=24&width=24"
              width={24}
              height={24}
              alt="Acme Inc. Logo"
              className="h-6 w-6"
            />
          </div>
          <h1 className="text-2xl font-bold">Welcome to ImageHub.</h1>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
