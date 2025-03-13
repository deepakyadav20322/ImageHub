// import { Button } from "@/components/ui/button"
// import { logout } from "@/redux/features/authSlice";
// import { RootState } from "@/redux/store"
// import { useDispatch, useSelector } from "react-redux"

// const Welcome = () => {
//   const {user} = useSelector((state:RootState)=>state.auth);
//   const dispatch = useDispatch()
//   return (
//     <>
//     <div className="pb-4">Welcome Page, {JSON.stringify(user,null,2)}</div>
//        <Button onClick={()=>dispatch(logout())}>Logout</Button>
//     </>
//   )
// }

// export default Welcome

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Image,
  User,
  Mail,
  Building,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

// Form schemas
const interestSchema = z.object({
  interest: z.string().min(1, "Please select an interest"),
});

const userInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  organization: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
});

// Form types
type InterestFormValues = z.infer<typeof interestSchema>;
type UserInfoFormValues = z.infer<typeof userInfoSchema>;
type FormData = InterestFormValues & UserInfoFormValues;

const Welcome = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  // Interest step form
  const interestForm = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      interest: formData.interest || "",
    },
  });

  // User info step form
  const userInfoForm = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      organization: formData.organization || "",
    },
  });

  const handleInterestSubmit = (data: InterestFormValues) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleUserInfoSubmit = (data: UserInfoFormValues) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);
    console.log("Form submitted with data:", finalData);
    setStep(3);
  };

  const goBack = () => {
    setStep(1);
  };

  const skipStep = () => {
    setStep(step + 1);
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      <h2 className="absolute top-12 left-4">Welcome to Image Hub</h2>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <h2 className="text-2xl font-bold text-center">Image Hub</h2>
          </div>

          {/* Progress Indicator */}
          {step < 3 && (
            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      step >= i ? "bg-indigo-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Form Steps Container */}
          <div className="min-h-[350px]">
            {" "}
            {/* Fixed height container to prevent layout shifts */}
            <AnimatePresence mode="wait">
              {/* Step 1: Interest Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <p className="text-center text-gray-600 text-sm mb-2">
                    Let's tailor your Cloudinary workspace for you
                  </p>
                  <h1 className="text-2xl font-bold text-center mb-8">
                    What's your main interest?
                  </h1>

                  <form
                    onSubmit={interestForm.handleSubmit(handleInterestSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-4 mb-8">
                      {/* Option 1 */}
                      <label
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.interest === "coding"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                        }`}
                      >
                        <input
                          type="radio"
                          value="coding"
                          {...interestForm.register("interest")}
                          className="sr-only"
                          onChange={() => {
                            interestForm.setValue("interest", "coding");
                            setFormData({ ...formData, interest: "coding" });
                          }}
                        />
                        <Code className="h-6 w-6 text-indigo-500 mr-4" />
                        <span>Coding with APIs and SDKs</span>
                      </label>

                      {/* Option 2 */}
                      <label
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.interest === "asset-management"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                        }`}
                      >
                        <input
                          type="radio"
                          value="asset-management"
                          {...interestForm.register("interest")}
                          className="sr-only"
                          onChange={() => {
                            interestForm.setValue(
                              "interest",
                              "asset-management"
                            );
                            setFormData({
                              ...formData,
                              interest: "asset-management",
                            });
                          }}
                        />
                        <Image className="h-6 w-6 text-indigo-500 mr-4" />
                        <span>Interactive Digital Asset Management</span>
                      </label>
                    </div>

                    {/* Error message */}
                    {interestForm.formState.errors.interest && (
                      <p className="text-red-500 text-sm mb-4">
                        {interestForm.formState.errors.interest.message}
                      </p>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="flex items-center justify-center px-5 py-2.5 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 transition-colors"
                      >
                        Let's Start <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>

                    {/* Skip button */}
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={skipStep}
                        className="text-gray-500 hover:text-indigo-500 underline"
                      >
                        Skip
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: User Information */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <h1 className="text-2xl font-bold text-center mb-8">
                    Tell us about yourself
                  </h1>

                  <form
                    onSubmit={userInfoForm.handleSubmit(handleUserInfoSubmit)}
                  >
                    {/* Name field */}
                    <div className="mb-5">
                      <label
                        htmlFor="name"
                        className="flex items-center text-sm font-medium mb-2"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Full Name</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
                          userInfoForm.formState.errors.name
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your name"
                        {...userInfoForm.register("name")}
                      />
                      {userInfoForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {userInfoForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email field */}
                    <div className="mb-5">
                      <label
                        htmlFor="email"
                        className="flex items-center text-sm font-medium mb-2"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Email Address</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
                          userInfoForm.formState.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                        {...userInfoForm.register("email")}
                      />
                      {userInfoForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {userInfoForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Organization field */}
                    <div className="mb-5">
                      <label
                        htmlFor="organization"
                        className="flex items-center text-sm font-medium mb-2"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        <span>Organization Name</span>
                      </label>
                      <input
                        id="organization"
                        type="text"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
                          userInfoForm.formState.errors.organization
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your organization"
                        {...userInfoForm.register("organization")}
                      />
                      {userInfoForm.formState.errors.organization && (
                        <p className="text-red-500 text-sm mt-1">
                          {userInfoForm.formState.errors.organization.message}
                        </p>
                      )}
                    </div>

                    {/* Form buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        type="button"
                        onClick={goBack}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex items-center justify-center px-5 py-2.5 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 transition-colors"
                      >
                        Complete Setup <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col items-center justify-center pt-4 py-8"
                >
                  <div className="border rounded-xl border-green-400 w-full lg:w-2/3 bg-green-100 h-full flex justify-center items-center py-6 mx-auto mb-2">
                    <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-green-600 mb-4">
                    All set!
                  </h1>

                  <p className="text-gray-600 mb-8 text-center max-w-xs">
                    Your Cloudinary workspace is ready. We've tailored it based
                    on your preferences.
                  </p>

                  <button className="px-6 py-2.5 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 transition-colors">
                    Go to Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
