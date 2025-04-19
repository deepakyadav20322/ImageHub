import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import { Link, useSearchParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useResetPasswordMutation } from "@/redux/apiSlice/authApi" 
import { toast } from "react-hot-toast"

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const ResetPasswordPage = () => {
  const [params] = useSearchParams()
  const token = params.get("token")
  const error = params.get("error")
  const isValidToken = !!token
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await resetPassword({ token, password: values.password }).unwrap()
      toast.success(res.data.message,{duration:4000})
      navigate("/login")
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong")
    }
  }

  if (!isValidToken) {
    return (
      <div className="container flex h-[90vh] w-screen flex-col items-center justify-center mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px] px-2 sm:px-1">
          <Card className="py-12">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Invalid or Expired Link</CardTitle>
              <CardDescription className="text-center">
                The password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Alert variant="default">
                <XCircle color="red" className="h-4 w-4" />
                <AlertTitle className="text-rose-600">Error</AlertTitle>
                <AlertDescription className="text-rose-400">
                  This password reset link is invalid or has expired. Please request a new one.
                </AlertDescription>
              </Alert>
              <Button className="w-full" asChild>
                <Link to="/forgot-password">Request New Link</Link>
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="mt-2 text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-[90vh] w-screen flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px] px-2 sm:px-1">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error === "mismatch"
                        ? "Passwords do not match. Please try again."
                        : "There was an error resetting your password. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </CardContent>
            </form>
          </Form>
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordPage
