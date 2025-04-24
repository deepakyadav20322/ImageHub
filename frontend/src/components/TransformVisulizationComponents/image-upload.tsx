
import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              onImageUpload(event.target.result as string)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [onImageUpload],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              onImageUpload(event.target.result as string)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [onImageUpload],
  )

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center bg-blue-200/10 hover:bg-blue-200/20 cursor-pointer ${
            isDragging ? "border-primary bg-primary/10" : "border-gray-300 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Drag and drop your image</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse from your computer</p>
            </div>
            <label className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-white bg-blue-600  rounded-md hover:bg-blue-700cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700">
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
