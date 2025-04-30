
// import { useState, useCallback, useEffect } from "react"
// import { ImageUpload } from "./image-upload"
// import { ImagePreview } from "./image-preview"
// import { TransformationControls } from "./transformation-controls"
// import { URLGenerator } from "./url-generator"
// import { validateTransformations } from "@/lib/validation"


// // Default placeholder image
// const DEFAULT_IMAGE = "/placeholder.svg?height=600&width=800"

// export type TransformationParams = {
//   w?: string
//   h?: string
//   c?: string
//   g?: string
//   f?: string
//   q?: string
//   e_grayscale?: boolean
//   e_sepia?: boolean
//   e_blur?: string
//   e_negate?: boolean
//   e_auto_orient?: boolean
//   a_hflip?: boolean
//   a_vflip?: boolean
//   a?: string
//   a_ignore?: boolean
// }

// export function ImageTransformer() {
//   const [image, setImage] = useState<string>(DEFAULT_IMAGE)
//   const [transformations, setTransformations] = useState<TransformationParams>({})
//   const [transformationUrl, setTransformationUrl] = useState<string>("")
//   const [isValid, setIsValid] = useState<boolean>(true)
//   const [validationError, setValidationError] = useState<string>("")

//   const handleImageUpload = useCallback((imageUrl: string) => {
//     setImage(imageUrl)
//   }, [])

//   const handleTransformationChange = useCallback((params: TransformationParams) => {
//     setTransformations(params)
//   }, [])

//   const resetTransformations = useCallback(() => {
//     setTransformations({})
//   }, [])

//   useEffect(() => {
//     // Generate transformation string
//     const transformParts: string[] = []

//     // Add width and height
//     if (transformations.w) transformParts.push(`w_${transformations.w}`)
//     if (transformations.h) transformParts.push(`h_${transformations.h}`)

//     // Add crop and gravity
//     if (transformations.c) transformParts.push(`c_${transformations.c}`)
//     if (transformations.g) transformParts.push(`g_${transformations.g}`)

//     // Add format and quality
//     if (transformations.f) transformParts.push(`f_${transformations.f}`)
//     if (transformations.q) transformParts.push(`q_${transformations.q}`)

//     // Add effects
//     if (transformations.e_grayscale) transformParts.push("e_grayscale")
//     if (transformations.e_sepia) transformParts.push("e_sepia")
//     if (transformations.e_blur) transformParts.push(`e_blur_${transformations.e_blur}`)
//     if (transformations.e_negate) transformParts.push("e_negate")
//     if (transformations.e_auto_orient) transformParts.push("e_auto_orient")

//     // Add flipping and rotation
//     if (transformations.a_hflip) transformParts.push("a_hflip")
//     if (transformations.a_vflip) transformParts.push("a_vflip")
//     if (transformations.a) transformParts.push(`a_${transformations.a}`)
//     if (transformations.a_ignore) transformParts.push("a_ignore")

//     const transformString = transformParts.join(",")

//     // Validate the transformation string
//     if (transformString) {
//       const validation = validateTransformations(transformString)
//       setIsValid(validation.valid)
//       setValidationError(validation.error || "")
//     } else {
//       setIsValid(true)
//       setValidationError("")
//     }

//     // Generate the URL
//     const baseUrl =
//       "https://example.com/3002/api/v1/resource/3a205cfe-238b-4532-803b-0321ebd7344c-original/image/upload/"
//     const fileName = "image-o0KQyzYN7GnKr8bclqTjSXqzt6QcEt.jpg"

//     const url = transformString ? `${baseUrl}${transformString}/${fileName}` : `${baseUrl}${fileName}`

//     setTransformationUrl(url)
//   }, [transformations])

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Upload & Controls</h2>
        
//         </div>
//         <ImageUpload onImageUpload={handleImageUpload} />
//         <TransformationControls
//           transformations={transformations}
//           onChange={handleTransformationChange}
//           onReset={resetTransformations}
//         />
//       </div>
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Preview & URL</h2>
//         <ImagePreview originalImage={image} transformations={transformations} transformationUrl={transformationUrl} />
//         <URLGenerator url={transformationUrl} isValid={isValid} validationError={validationError} />
//       </div>
//     </div>
//   )
// }



import { useState, useCallback, useEffect } from "react"
import { useSearchParams} from "react-router" // or use `useRouter` in Next.js
import { ImagePreview } from "./image-preview"
import { TransformationControls } from "./transformation-controls"
import { URLGenerator } from "./url-generator"
import { validateTransformations } from "@/lib/validation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const DEFAULT_IMAGE = "/placeholder.svg?height=600&width=800"

export type TransformationParams = {
  w?: string
  h?: string
  c?: string
  g?: string
  f?: string
  q?: string
  e_grayscale?: boolean
  e_sepia?: boolean
  e_blur?: string
  e_negate?: boolean
  // e_auto_orient?: boolean
  a_hflip?: boolean
  a_vflip?: boolean
  a?: string
  a_ignore?: boolean
}

export function ImageTransformer() {
  const [searchParams] = useSearchParams();
  const resourcePath = searchParams.get("resourcePath");
  console.log(resourcePath)
  const [image, setImage] = useState<string>("")
  const [transformations, setTransformations] = useState<TransformationParams>({})
  const [transformationUrl, setTransformationUrl] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean>(true)
  const [validationError, setValidationError] = useState<string>("")
  // const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const {user} = useSelector((state:RootState)=>state.auth);

  useEffect(()=>{
    setImage(`${import.meta.env.VITE_API_URL_V1}/resource/${user?.accountId+'-original'}/image/upload/${resourcePath}`)
  },[resourcePath])

  // Fetch image by resourceId
  // useEffect(() => {
  //   const fetchImage = async () => {
  //     try {
  //       setLoading(true)
  //       setError("")

  //       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resource/${user?.accountId+'-original'}/image/upload/${resourcePath}`)
        
  //       if (res.status==200) {

  //       const data = await res.json()
  //       setImage(data.imageUrl) // Make sure your API returns this key
  //       }else{
         
  //       }
  //     } catch (err: any) {
  //       setError(err.message || "Failed to load image.")
  //       setImage(DEFAULT_IMAGE)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (resourceId) fetchImage()
  // }, [resourceId])

  const handleTransformationChange = useCallback((params: TransformationParams) => {
    setTransformations(params)
  }, [])

  const resetTransformations = useCallback(() => {
    setTransformations({})
  }, [])

  useEffect(() => {
    const transformParts: string[] = []

    if (transformations.w) transformParts.push(`w_${transformations.w}`)
    if (transformations.h) transformParts.push(`h_${transformations.h}`)
    if (transformations.c) transformParts.push(`c_${transformations.c}`)
    if (transformations.g) transformParts.push(`g_${transformations.g}`)
    if (transformations.f) transformParts.push(`f_${transformations.f}`)
    if (transformations.q) transformParts.push(`q_${transformations.q}`)
    if (transformations.e_grayscale) transformParts.push("e_grayscale")
    if (transformations.e_sepia) transformParts.push("e_sepia")
    if (transformations.e_blur) transformParts.push(`e_blur_${transformations.e_blur}`)
    if (transformations.e_negate) transformParts.push("e_negate")
    // if (transformations.e_auto_orient) transformParts.push("e_auto_orient")
    if (transformations.a_hflip) transformParts.push("a_hflip")
    if (transformations.a_vflip) transformParts.push("a_vflip")
    if (transformations.a) transformParts.push(`a_${transformations.a}`)
    if (transformations.a_ignore) transformParts.push("a_ignore")

    const transformString = transformParts.join(",")

    if (transformString) {
      const validation = validateTransformations(transformString)
      setIsValid(validation.valid)
      setValidationError(validation.error || "")
    } else {
      setIsValid(true)
      setValidationError("")
    }

    const baseUrl = `${import.meta.env.VITE_API_URL_V1}/resource/${user?.accountId+'-original'}/image/upload/`
    // const fileName = "image-o0KQyzYN7GnKr8bclqTjSXqzt6QcEt.jpg"
    const url = transformString ? `${baseUrl}${transformString}/${resourcePath}` : `${baseUrl}${resourcePath}`

    setTransformationUrl(url)
  }, [transformations, resourcePath])

  // if (loading) return <div className="text-center text-lg text-gray-500">Loading image...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Controls</h2> */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <TransformationControls
          transformations={transformations}
          onChange={handleTransformationChange}
          onReset={resetTransformations}
        />
      </div>
      <div className="space-y-6">
        {/* <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Preview & URL</h2> */}
        <ImagePreview originalImage={image} transformations={transformations} transformationUrl={transformationUrl} />
        <URLGenerator url={transformationUrl} isValid={isValid} validationError={validationError} />
      </div>
    </div>
  )
}
