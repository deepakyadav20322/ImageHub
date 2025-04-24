import { ImageTransformer } from "@/components/TransformVisulizationComponents/image-transformer"

 const TransformationVisulizationPage  = ()=> {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 ">
       
      <div className="max-w-7xl mx-auto ">
     
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100 relative">
        <div className="absolute right-1/2 top-1/2 h-[100px] w-[80%] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#155dfc]/20 blur-[100px] opacity-50" />
     
          Image Transformation Visulizer and url generator
        </h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Upload an image and apply transformations in real-time. Generate a URL with your selected parameters.
        </p>
        <ImageTransformer />
      </div>
    </main>
  )
}

export default TransformationVisulizationPage;