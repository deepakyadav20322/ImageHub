
import { useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ShareLinksModal from './ShareLinksModal'
interface ShareButtonProps {
  imageData: {
    id: string
    name: string
  }
  className?: string,
  type?: 'button'|'link'
}

const ShareButton = ({ imageData, className,type='button' }: ShareButtonProps)=> {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
    { type==='link'?(<>
      <div
        onClick={() => setIsModalOpen(true)}
        className={cn("flex items-center gap-2 cursor-pointer", className)}
      >
        <Share2 className="h-4 w-4" />
        Share Public link
      </div>

    </>):( <Button
        onClick={() => setIsModalOpen(true)}
        className={cn("flex items-center gap-2 cursor-pointer", className)}
        size="sm"
        variant="outline"
      >
        <Share2 className="h-4 w-4" />
        Share Public link
      </Button>)}

      <ShareLinksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageData={imageData} />
    </>
  )
}

export default ShareButton
