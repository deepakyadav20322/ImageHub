import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/ZodSchema";
import {z} from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/lib/Icons";
import { useLoginMutation } from "@/redux/apiSlice/authApi";
import { setAuth } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";


// types
type LoginFormValues = z.infer<typeof loginSchema>;


const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch   = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const [login,{isSuccess}] = useLoginMutation()

  const onSubmit = async(data: LoginFormValues)=> {
    setIsLoading(true);
    setError(null);

    try {
      // This is where you would call your authentication API
      console.log("Login data:", data);
      const response = await login(data).unwrap();
      console.log("login data",response);
      if(response && response.data){
      dispatch(setAuth({
        user: response.data.user,
        token: response.data.token,
        permissions:response.data.permissions
      }));
    }
      // On success, redirect to welcome if(not submited prefrece previousaly)
 if(response.data?.welcome){
      navigate("/welcome");
 }else{
  navigate("/dashboard")
 }
    } catch (error:any) {
      // setError("Invalid email or password. Please try again.");
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);

    try {
      // This is where you would implement Google Sign In
      console.log("Google Sign In");


      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to dashboard
      navigate("/dashboard/welcome");
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error('❌ Login error:', err);
    
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive dark:bg-destructive/50 dark:text-[#dc0215]">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                <div className="flex items-center justify-between w-full">
      <FormLabel>Password</FormLabel>
      <Link
        to="/forgot-password"
        className="text-sm text-muted-foreground hover:text-primary"
      >
        Forgot password?
      </Link>
    </div>

                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full cursor-not-allowed"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default LoginForm;
