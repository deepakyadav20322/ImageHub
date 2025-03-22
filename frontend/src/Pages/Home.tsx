import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, UploadCloud, Users, BarChart, Globe, Settings } from "lucide-react";

const Home = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      
      <header className="w-full py-16 text-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">Manage Your Assets Seamlessly</h1>
        <p className="text-lg text-gray-600 mt-4 max-w-lg mx-auto">
          Securely store, organize, and transform your assets with our powerful cloud-based solution.
        </p>
        <Button className="mt-6 px-6 py-3 text-lg">Get Started</Button>
      </header>

      {/* Features Section */}
      <section className="w-full py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {features.map((feature, index) => (
          <Card key={index} className="shadow-lg rounded-2xl p-6">
            <CardContent className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 text-center bg-gray-50">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-lg text-gray-600 mt-4 max-w-lg mx-auto">
          Our platform makes asset management simple and efficient in just a few steps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
          {steps.map((step, index) => (
            <Card key={index} className="shadow-md rounded-2xl p-6">
              <CardContent className="text-center">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 text-center bg-white">
        <h2 className="text-3xl font-bold">What Our Users Say</h2>
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-md rounded-2xl p-6">
              <CardContent>
                <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
                <h4 className="text-lg font-semibold mt-4">- {testimonial.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 text-center bg-gray-900 text-white">
        <h2 className="text-3xl font-bold">Start Managing Your Assets Today</h2>
        <p className="text-lg text-gray-300 mt-4 max-w-lg mx-auto">
          Sign up now and take full control of your digital assets with our intuitive platform.
        </p>
        <Button className="mt-6 px-6 py-3 text-lg bg-white text-gray-900 hover:bg-gray-200">Sign Up Now</Button>
      </section>

      {/* Footer Section */}
      <footer className="w-full py-6 text-center bg-gray-100 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Asset Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

const features = [
  { title: "Secure Storage", description: "Store your assets in a highly secure and scalable environment.", icon: <Shield size={40} className="text-blue-500" /> },
  { title: "Easy Uploads", description: "Quickly upload and manage your files with a simple interface.", icon: <UploadCloud size={40} className="text-green-500" /> },
  { title: "Access Control", description: "Grant and manage access for different users and teams.", icon: <Users size={40} className="text-purple-500" /> },
  { title: "Reliable Processing", description: "Transform and optimize images with powerful processing tools.", icon: <CheckCircle size={40} className="text-yellow-500" /> },
  { title: "Analytics", description: "Get detailed insights on your asset usage and performance.", icon: <BarChart size={40} className="text-indigo-500" /> },
  { title: "Global Access", description: "Access your assets anytime, anywhere from any device.", icon: <Globe size={40} className="text-teal-500" /> },
];

const steps = [
  { title: "Sign Up", description: "Create an account to get started with asset management." },
  { title: "Upload Assets", description: "Easily upload your assets with our intuitive interface." },
  { title: "Manage & Optimize", description: "Organize, transform, and analyze your assets efficiently." },
];

const testimonials = [
  { name: "John Doe", feedback: "This platform has transformed how we manage our digital assets!" },
  { name: "Jane Smith", feedback: "The ease of use and security make it the best solution out there." },
];


export default Home