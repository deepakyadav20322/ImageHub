import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import z from 'zod'
import { FormField } from "./ui/form"
import { useForgetPasswordMutation } from "@/redux/apiSlice/authApi"
import toast from "react-hot-toast"
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useState } from "react"

// Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' })
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const [forgetPassword, { isLoading, isError, error }] = useForgetPasswordMutation()
  const [successMeg,setSuccessMeg] = useState<string>('')
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setSuccessMeg('')
    try {
       console.log(data)
      const response = await forgetPassword(data).unwrap();
      if(response){
        console.log('Password reset link sent successfully')
      setSuccessMeg('Password reset link sent successfully on your email.')
      }
    
      // Handle success (can show success notification, etc.)
     
    } catch (err: any) {
      // Handle error (optional since RTK Query manages the error state)
      console.error('Error:', err)
      setSuccessMeg('')
    }
  }

  return (
    <div className="container flex h-[90vh] flex-col items-center justify-center mx-auto">
  
      <div className="mx-auto flex w-full flex-col justify-center sm:w-[420px] px-2 sm:px-1">
      {
  !isError && (successMeg!=="") && (
    <div className="flex items-center justify-between text-green-900 bg-green-100 border-green-200 p-4 py-2 mb-4 rounded-lg dark:bg-green-950 dark:border-green-900 dark:text-green-200 shadow-lg border-2 w-full">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 text-green-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-semibold">{successMeg}</p>
      </div>
     
    </div>
  )
}
        <Card className="py-14">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <FormField
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`${errors.email ? 'border-red-500' : ''}`}
                        {...field}
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </>
                  )}
                />
              </div>

              {/* Show loading text on button when isLoading is true */}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            {isError && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error && 'status' in error ? (error as FetchBaseQueryError).data?.toString() : 'Failed to send reset link. Please try again.'}
              </p>
            )}
          

          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
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

export default ForgotPassword
