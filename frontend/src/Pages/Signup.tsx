
import { Link } from "react-router";
import  SignUpForm  from "@/components/SignupForm"


export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center px-4 mx-auto">
      <div className="w-full space-y-6 max-w-md">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-gray-100 p-2">
            {/* <img
              src="/placeholder.svg?height=24&width=24"
              width={24}
              height={24}
              alt="Acme Inc. Logo"
              className="h-6 w-6"
            /> */}
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center border-2 ">
              <span className="dark:text-primary-foreground text-blue-600  font-bold">MH</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline underline-offset-4">
              Login
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}

