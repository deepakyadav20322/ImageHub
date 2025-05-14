import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { redirect, useNavigate, useParams } from "react-router";
import {
  useGetInviteUserInfoQuery,
  useRegisterInviteUserMutation,
} from "@/redux/apiSlice/authApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Clock, LogOut, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";

// Form validation schema
const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const InviteRegistration = () => {
  const { inviteToken } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [registerInviteUser] = useRegisterInviteUserMutation();
  const { data } = useGetInviteUserInfoQuery({ inviteToken });
  const inviterName = `${data?.data?.inviter.firstName} ${data?.data?.inviter.lastName}`;

  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Update email field when URL param changes
  useEffect(() => {
    if (data?.data?.email) {
      form.reset({
        firstName: "",
        lastName: "",
        email: data?.data?.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [data, inviteToken]);

  const dispatch = useDispatch();

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const res = await registerInviteUser({ ...values, inviteToken }).unwrap();
      console.log(res);
      if (res?.data.success) {
        toast.success("You have successfully created your account.");
      }
      redirect("/login");
      console.log("Form submitted with values:", { ...values });
    } catch (error) {
      toast.error(
        "There was an error creating your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render different states based on invite status
  const renderContent = () => {
    const status = data?.data?.status;
    const expiresAt = new Date(data?.data?.expiresAt);
    const isExpired = new Date() > expiresAt;

    if (status === "accepted") {
      return (
        <div className="space-y-4">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Registration Complete
            </CardTitle>
            <CardDescription className="text-lg">
              You've already joined as an{" "}
              <strong className="capitalize">{"invited role"}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground italic">
              Invited by{" "}
              <span className="font-medium text-blue-600 ">{inviterName}</span>
            </p>
            <Button className="mt-6 w-full" onClick={() => redirect("/login")}>
              Go to Login
            </Button>
          </CardContent>
        </div>
      );
    }

    if (status === "pending" && isExpired) {
      return (
        <div className="space-y-4">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Invitation Expired
            </CardTitle>
            <CardDescription className="text-lg">
              This invite link is no longer valid
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This invitation expired on <br />
              <span className="font-medium">
                {expiresAt.toLocaleDateString()}
              </span>
            </p>
            <p>
              Please contact{" "}
              <span className="font-medium text-primary">{inviterName}</span>{" "}
              for a new invitation
            </p>
          </CardContent>
        </div>
      );
    }

    if (status === "pending" && !isExpired) {
      return (
        <>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Complete your invite registration
            </CardTitle>
            <CardDescription>
              <div className="flex flex-col">
                <p>Fill out the form below to create your account</p>
                <p className="pt-2 italic">
                  You are invited by{" "}
                  <strong className="text-green-500">
                    {data?.data?.inviter.firstName}
                  </strong>{" "}
                  <strong className="text-green-500">
                    {data?.data?.inviter.lastName}.
                  </strong>
                </p>
                {/* <div className="flex items-center pt-2 text-sm text-yellow-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Expires on {expiresAt.toLocaleDateString()}</span>
                </div> */}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled
                          className="bg-muted border-green-800 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription>
                        Email address from your invitation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>At least 8 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </CardFooter>
        </>
      );
    }

    // Default case (loading or unknown status)
    return (
      <>
        <div className="w-full h-full flex justify-center items-center">
          <div className="animate-spin text-center rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      </>
    );
  };
  if (user && token) {
    return (
      <div className="container flex items-center justify-center h-[calc(100vh-64px)] py-12 mx-auto">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <LogOut className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Already Logged In
            </CardTitle>
            <CardDescription className="text-lg">
              You're currently logged in as another account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              To accept this invite, please logout first
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/media")}
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => {
                  // Implement your logout logic here
                  // For example:
                  dispatch(logout());
                  toast.success("Logged out successfully");
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center h-[calc(100vh-64px)] py-12 mx-auto">
      <Card className="w-full max-w-lg dark:bg-zinc-900">
        {renderContent()}
      </Card>
    </div>
  );
};

export default InviteRegistration;
