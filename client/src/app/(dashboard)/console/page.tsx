import React from 'react'
import { Button } from '@/components/ui/button'
const page = () => {
  return (
    <div className='py-8 px-4'>
     
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-3xl font-semibold">Media Assets</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <code className="text-sm">&lt;/&gt;</code>
            <span>API</span>
          </Button>
          <Button className="gap-2">
            {/* <Upload className="h-4 w-4" /> */}
            <span>Upload</span>
          </Button>
        </div>
      </div>
    </div>
  
  )
}

export default page