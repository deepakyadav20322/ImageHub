
import { CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Link, useSearchParams } from "react-router"


export default function VerifyEmailPage() {
  // This would normally check the token from searchParams and verify the email
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")
  const isVerified = !!token && !error


  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
     
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px] px-2 sm:px-1">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {isVerified ? "Your email has been verified successfully" : "We need to verify your email address"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error === "expired"
                    ? "Verification link has expired. Please request a new one."
                    : "There was an error verifying your email. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {isVerified ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-center text-sm text-muted-foreground">
                  Your email has been verified successfully. You can now login to your account.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/login">Go to Login</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-sm text-muted-foreground">
                  We've sent a verification link to your email address. Please check your inbox and click the link to
                  verify your email.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/resend-verification">Resend Verification Email</Link>
                </Button>
              </div>
            )}
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
