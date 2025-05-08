import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUserProfileUpdateMutation } from "@/redux/apiSlice/authApi"
import { Camera, Loader2, User } from "lucide-react"
import toast from "react-hot-toast"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"



// Define form validation schema
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileTab() {
  const [updateUserProfile, { isLoading }] = useUserProfileUpdateMutation();
 const user = useSelector((state:RootState)=>state.auth.user)
 const token = useSelector((state:RootState)=>state.auth.token)
  const {
    register,
    handleSubmit,
    formState: { errors,isDirty  },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // You can set initial values here if you have them
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: "",
      bio: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      console.log(data)
      const response = await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        userId:user?.userId,
        token:token??''
        // Include other fields as needed
      }).unwrap();
      if(response.success){
        toast.success("Profile updated successfully");
        console.log("user res",response)

      }

      // Optionally reset form or update local state
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="space-y-6 ">
      <Card className="dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-blue-500">Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed"
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Upload profile picture</span>
                </Button>
              </div>
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      className="dark:border-gray-600"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                       className="dark:border-gray-600"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                     className="dark:border-gray-700 disabled:cursor-not-allowed"
                    {...register("email")}
                    disabled // If email shouldn't be editable
                    aria-disabled
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    disabled
                    aria-disabled
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="min-h-[120px] dark:bg-gray-900"
                {...register("bio")}
                disabled
                aria-disabled
              />
            </div>
            <CardFooter className="flex justify-end px-0 pb-0 pt-6">
            <Button
  type="submit"
  disabled={!isDirty || isLoading}
  className={`transition-colors ${
    isDirty
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-gray-300 text-gray-500"
  } ${
    isLoading ? "cursor-wait" : isDirty ? "cursor-pointer" : "cursor-not-allowed"
  }`}
>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Saving...
    </span>
  ) : (
    "Save Changes"
  )}
</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}