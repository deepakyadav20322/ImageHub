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
import { Link } from "react-router";
import { useWelcomeOnboardingMutation } from "@/redux/apiSlice/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Form schemas
const interestSchema = z.object({
  interest: z.string().min(1, "Please select an interest"),
});

const userInfoSchema = z.object({
  // name: z.string().min(2, "Name must be at least 2 characters"),
  // email: z.string().email("Please enter a valid email"),
  organization: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
});

// Form types
type InterestFormValues = z.infer<typeof interestSchema>;
type UserInfoFormValues = z.infer<typeof userInfoSchema>;
type FormData = InterestFormValues & UserInfoFormValues;

const WelcomeForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const [onboarding, { isLoading }] = useWelcomeOnboardingMutation();

  const { token } = useSelector((state: RootState) => state.auth);
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
      organization: formData.organization || "",
    },
  });

  const handleInterestSubmit = (data: InterestFormValues) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleUserInfoSubmit = async (data: UserInfoFormValues) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);
    alert(JSON.stringify(finalData))
    try {
    await onboarding({
        organization: finalData.organization,
        interest: finalData.interest,
        token:token
      })
      console.log("Form submitted with data:", finalData);
    } catch (error) {
      toast.error("Something error during onboarding"+error);
      console.log(error);
    }
    setStep(3);
  };

  const goBack = () => {
    setStep(1);
  };

  const skipStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex items-center justify-center bg-slate-50 dark:bg-[var(--background)] p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-md dark:shadow-slate-800/30 overflow-hidden transition-colors duration-300">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <h2 className="text-center font-bold text-2xl underline">
              MediaHub
            </h2>
          </div>

          {/* Progress Indicator */}
          {step < 3 && (
            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      step >= i
                        ? "bg-indigo-500"
                        : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Form Steps Container */}
          <div className="min-h-[350px]">
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
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-2 transition-colors duration-300">
                    Let's tailor your Cloudinary workspace for you
                  </p>
                  <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">
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
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 dark:border-indigo-400"
                            : "border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
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
                        <Code className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-4" />
                        <span className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                          Coding with APIs and SDKs
                        </span>
                      </label>

                      {/* Option 2 */}
                      <label
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.interest === "asset-management"
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 dark:border-indigo-400"
                            : "border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
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
                        <Image className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-4" />
                        <span className="text-gray-800 dark:text-gray-200 transition-colors duration-300">
                          Interactive Digital Asset Management
                        </span>
                      </label>
                    </div>

                    {/* Error message */}
                    {interestForm.formState.errors.interest && (
                      <p className="text-red-500 dark:text-red-400 text-sm mb-4 transition-colors duration-300">
                        {interestForm.formState.errors.interest.message}
                      </p>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="flex items-center justify-center px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-300"
                      >
                        Let's Start <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>

                    {/* Skip button */}
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={skipStep}
                        className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 underline transition-colors duration-300"
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
                  <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">
                    Tell us about yourself
                  </h1>

                  <form
                    onSubmit={userInfoForm.handleSubmit(handleUserInfoSubmit)}
                  >
                    {/* Organization field */}
                    <div className="mb-5">
                      <label
                        htmlFor="organization"
                        className="flex items-center text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        <span>Organization/company Name</span>
                      </label>
                      <input
                        id="organization"
                        type="text"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${
                          userInfoForm.formState.errors.organization
                            ? "border-red-500 dark:border-red-400"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Enter your organization"
                        {...userInfoForm.register("organization")}
                      />
                      {userInfoForm.formState.errors.organization && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                          {userInfoForm.formState.errors.organization.message}
                        </p>
                      )}
                    </div>

                    {/* Form buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        type="button"
                        onClick={goBack}
                        className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex items-center justify-center px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-300"
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
                  className="h-full flex flex-col items-center justify-center py-8"
                >
                  <div className="border rounded-xl border-green-400 dark:border-green-600 w-full lg:w-2/3 bg-green-100 dark:bg-green-900/30 h-full flex justify-center items-center py-6 mx-auto mb-2 transition-colors duration-300">
                    <div className="h-16 w-16 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                    All set!
                  </h1>

                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-xs transition-colors duration-300">
                    Your MediaHub workspace is ready. We've tailored it based on
                    your preferences.
                  </p>

                  <Link
                    to={"/dashboard"}
                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-300"
                  >
                    Go to Dashboard
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
