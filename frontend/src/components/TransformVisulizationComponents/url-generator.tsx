
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, AlertCircle } from "lucide-react"
import {toast}  from "react-hot-toast"

interface URLGeneratorProps {
  url: string
  isValid: boolean
  validationError: string
}

export function URLGenerator({ url, isValid, validationError }: URLGeneratorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('The transformation URL has been copied to your clipboard.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Transformation URL</h3>
          <div className="flex items-center">
            {isValid ? (
              <div className="flex items-center text-green-500 text-sm">
                <Check className="h-4 w-4 mr-1" />
                Valid
              </div>
            ) : (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                Invalid
              </div>
            )}
          </div>
        </div>

        {!isValid && validationError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
            {validationError}
          </div>
        )}

        <div className="relative">
          <div
            className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-mono break-all ${
              !isValid ? "border border-red-300 dark:border-red-700" : ""
            }`}
          >
            {url}
          </div>
          <Button size="sm" variant="ghost" className="absolute -top-2 -right-1 cursor-pointer" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy URL</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
