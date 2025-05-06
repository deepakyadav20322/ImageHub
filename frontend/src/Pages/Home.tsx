// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, Shield, UploadCloud, Users, BarChart, Globe, Settings } from "lucide-react";

// const Home = () => {
//   return (
//     <div className="w-full flex flex-col items-center">
//       {/* Hero Section */}
      
//       <header className="w-full py-16 text-center bg-gray-100">
//         <h1 className="text-4xl font-bold text-gray-900">Manage Your Assets Seamlessly</h1>
//         <p className="text-lg text-gray-600 mt-4 max-w-lg mx-auto">
//           Securely store, organize, and transform your assets with our powerful cloud-based solution.
//         </p>
//         <Button className="mt-6 px-6 py-3 text-lg">Get Started</Button>
//       </header>

//       {/* Features Section */}
//       <section className="w-full py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
//         {features.map((feature, index) => (
//           <Card key={index} className="shadow-lg rounded-2xl p-6">
//             <CardContent className="flex flex-col items-center text-center">
//               {feature.icon}
//               <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
//               <p className="text-gray-600 mt-2">{feature.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </section>

//       {/* How It Works Section */}
//       <section className="w-full py-16 text-center bg-gray-50">
//         <h2 className="text-3xl font-bold">How It Works</h2>
//         <p className="text-lg text-gray-600 mt-4 max-w-lg mx-auto">
//           Our platform makes asset management simple and efficient in just a few steps.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
//           {steps.map((step, index) => (
//             <Card key={index} className="shadow-md rounded-2xl p-6">
//               <CardContent className="text-center">
//                 <h3 className="text-xl font-semibold">{step.title}</h3>
//                 <p className="text-gray-600 mt-2">{step.description}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="w-full py-16 text-center bg-white">
//         <h2 className="text-3xl font-bold">What Our Users Say</h2>
//         <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {testimonials.map((testimonial, index) => (
//             <Card key={index} className="shadow-md rounded-2xl p-6">
//               <CardContent>
//                 <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
//                 <h4 className="text-lg font-semibold mt-4">- {testimonial.name}</h4>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="w-full py-16 text-center bg-gray-900 text-white">
//         <h2 className="text-3xl font-bold">Start Managing Your Assets Today</h2>
//         <p className="text-lg text-gray-300 mt-4 max-w-lg mx-auto">
//           Sign up now and take full control of your digital assets with our intuitive platform.
//         </p>
//         <Button className="mt-6 px-6 py-3 text-lg bg-white text-gray-900 hover:bg-gray-200">Sign Up Now</Button>
//       </section>

//       {/* Footer Section */}
//       <footer className="w-full py-6 text-center bg-gray-100 text-gray-600 text-sm">
//         <p>&copy; {new Date().getFullYear()} Asset Management. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// const features = [
//   { title: "Secure Storage", description: "Store your assets in a highly secure and scalable environment.", icon: <Shield size={40} className="text-blue-500" /> },
//   { title: "Easy Uploads", description: "Quickly upload and manage your files with a simple interface.", icon: <UploadCloud size={40} className="text-green-500" /> },
//   { title: "Access Control", description: "Grant and manage access for different users and teams.", icon: <Users size={40} className="text-purple-500" /> },
//   { title: "Reliable Processing", description: "Transform and optimize images with powerful processing tools.", icon: <CheckCircle size={40} className="text-yellow-500" /> },
//   { title: "Analytics", description: "Get detailed insights on your asset usage and performance.", icon: <BarChart size={40} className="text-indigo-500" /> },
//   { title: "Global Access", description: "Access your assets anytime, anywhere from any device.", icon: <Globe size={40} className="text-teal-500" /> },
// ];

// const steps = [
//   { title: "Sign Up", description: "Create an account to get started with asset management." },
//   { title: "Upload Assets", description: "Easily upload your assets with our intuitive interface." },
//   { title: "Manage & Optimize", description: "Organize, transform, and analyze your assets efficiently." },
// ];

// const testimonials = [
//   { name: "John Doe", feedback: "This platform has transformed how we manage our digital assets!" },
//   { name: "Jane Smith", feedback: "The ease of use and security make it the best solution out there." },
// ];


// export default Home


import React from 'react'
import FeaturesSection from '@/components/landingPageComponents/FeaturesSection'

import HeroSection from '@/components/landingPageComponents/HeroSection'
import ShareButtonOrLink from '@/components/ShareOptionsComponents/ShareButtonOrLink'
import { lazy, Suspense } from "react"
import TransformationSection from '@/components/landingPageComponents/TransformationSection'

// Lazy load non-critical sections
const UseCasesSection = lazy(() => import("@/components/landingPageComponents/UseCasesSection"))
const PricingSection = lazy(() => import("@/components/landingPageComponents/PricingSection"))
const CTASection = lazy(() => import("@/components/landingPageComponents/CTASection"))
const FooterSection = lazy(() => import("@/components/landingPageComponents/FooterSection"))

// Add loading fallbacks
const SectionLoading = () => (
  <div className="w-full py-24 flex justify-center items-center">
    <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-[#155dfc] animate-spin"></div>
  </div>
)

export default function LandingPage() {
  return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        {/* <Header /> */}
        <main className="relative flex-1">
          {/* Global background decorative elements */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02]" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(21,93,252,0.15),rgba(255,255,255,0))]" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(21,93,252,0.15),rgba(255,255,255,0))]" />

          {/* Content sections */}
          <div className="relative">
            <HeroSection />
           
            
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
              <FeaturesSection />
            </div>
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
              <TransformationSection />
            </div>
            <Suspense fallback={<SectionLoading />}>
              <div className="relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
                <UseCasesSection />
              </div>
            </Suspense>
            <Suspense fallback={<SectionLoading />}>
              <div className="relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
                <PricingSection />
              </div>
            </Suspense>
            <Suspense fallback={<SectionLoading />}>
              <div className="relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
                <CTASection />
              </div>
            </Suspense>
          </div>
        </main>
        <Suspense fallback={<SectionLoading />}>
          <FooterSection />
        </Suspense>
      </div>
    
  )
}
