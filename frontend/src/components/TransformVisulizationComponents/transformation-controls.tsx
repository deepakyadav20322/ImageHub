
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components//ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Info } from "lucide-react"
import type { TransformationParams } from "./image-transformer"
import { SUPPORTED_GRAVITY } from "@/lib/validation"

interface TransformationControlsProps {
  transformations: TransformationParams
  onChange: (params: TransformationParams) => void
  onReset: () => void
}

export function TransformationControls({ transformations, onChange, onReset }: TransformationControlsProps) {
  const updateTransformation = (key: keyof TransformationParams, value: string | boolean) => {
    onChange({ ...transformations, [key]: value })
  }

  return (
    <Card className="overflow-hidden ">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-semibold">Transformation Controls</h3>
        <Button variant="outline" size="sm" onClick={onReset} className="flex items-center cursor-pointer">
          <RefreshCw className="h-4 w-4 mr-2 " />
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["resize", "format", "effects", "flipping"]}>
        <AccordionItem value="resize">
          <AccordionTrigger className="px-4 text-blue-600 dark:text-blue-400">Resize & Crop -----------------</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="width">Width (w)</Label>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Width in pixels (1-5000)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm text-gray-500">{transformations.w || "Auto"}</span>
                </div>
                <Input
                  id="width"
                  type="number"
                  min={1}
                  max={5000}
                  value={transformations.w || ""}
                  onChange={(e) => updateTransformation("w", e.target.value)}
                  placeholder="Auto"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="height">Height (h)</Label>
                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Height in pixels (1-5000)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm text-gray-500">{transformations.h || "Auto"}</span>
                </div>
                <Input
                  id="height"
                  type="number"
                  min={1}
                  max={5000}
                  value={transformations.h || ""}
                  onChange={(e) => updateTransformation("h", e.target.value)}
                  placeholder="Auto"
                />
              </div>
            </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Label htmlFor="crop-mode">Crop Mode (c)</Label>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How the image should be cropped</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select value={transformations.c || ""} onValueChange={(value) => updateTransformation("c", value)}>
                <SelectTrigger id="crop-mode">
                  <SelectValue placeholder="Select crop mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="inside">Inside</SelectItem>
                  <SelectItem value="outside">Outside</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Label htmlFor="gravity">Gravity (g)</Label>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Which part of the image to focus on when cropping</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select value={transformations.g || ""} onValueChange={(value) => updateTransformation("g", value)}>
                <SelectTrigger id="gravity">
                  <SelectValue placeholder="Select gravity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {SUPPORTED_GRAVITY.map((gravity) => (
                    <SelectItem key={gravity} value={gravity}>
                      {gravity.charAt(0).toUpperCase() + gravity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="format">
          <AccordionTrigger className="px-4 text-blue-600 dark:text-blue-400">Format & Quality ---------------</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Label>Format (f)</Label>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Output image format</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <RadioGroup
                value={transformations.f || ""}
                onValueChange={(value) => updateTransformation("f", value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpeg" id="jpeg" />
                  <Label htmlFor="jpeg">JPEG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="png" />
                  <Label htmlFor="png">PNG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="webp" id="webp" />
                  <Label htmlFor="webp">WebP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="avif" id="avif" />
                  <Label htmlFor="avif">AVIF</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label>Quality (q)</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Image quality (1-100)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-gray-500">{transformations.q || "80"}%</span>
              </div>
              <Slider
                value={[Number.parseInt(transformations.q || "80")]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => updateTransformation("q", value[0].toString())}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="effects">
          <AccordionTrigger className="px-4 text-blue-600">Effects -----------------</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="grayscale">Grayscale</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Convert image to grayscale</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="grayscale"
                  checked={transformations.e_grayscale || false}
                  onCheckedChange={(checked) => updateTransformation("e_grayscale", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="sepia">Sepia</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Apply sepia filter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="sepia"
                  checked={transformations.e_sepia || false}
                  onCheckedChange={(checked) => updateTransformation("e_sepia", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="negate">Negate</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Invert image colors</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="negate"
                  checked={transformations.e_negate || false}
                  onCheckedChange={(checked) => updateTransformation("e_negate", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* <div className="flex items-center">
                        <Label htmlFor="auto-orient">Auto Orient</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div> */}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Automatically orient image based on EXIF data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* <Switch
                  id="auto-orient"
                  checked={transformations.e_auto_orient || false}
                  onCheckedChange={(checked) => updateTransformation("e_auto_orient", checked)}
                /> */}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label>Blur</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Apply blur effect (0.3-1000)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-gray-500">{transformations.e_blur || "0"}</span>
              </div>
              <Slider
                value={[Number.parseFloat(transformations.e_blur || "0")]}
                min={0}
                max={100}
                step={0.1}
                disabled={!transformations.e_blur}
                onValueChange={(value) => updateTransformation("e_blur", value[0].toString())}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-blur"
                  checked={!!transformations.e_blur}
                  onCheckedChange={(checked) => updateTransformation("e_blur", checked ? "10" : "")}
                />
                <Label htmlFor="enable-blur">Enable Blur</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="flipping">
          <AccordionTrigger className="px-4 text-blue-600 dark:text-blue-400">Flipping & Rotation --------------</AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="hflip">Horizontal Flip</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Flip image horizontally</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="hflip"
                  checked={transformations.a_hflip || false}
                  onCheckedChange={(checked) => updateTransformation("a_hflip", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="vflip">Vertical Flip</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Flip image vertically</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="vflip"
                  checked={transformations.a_vflip || false}
                  onCheckedChange={(checked) => updateTransformation("a_vflip", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="ignore-exif">Ignore EXIF</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ignore EXIF orientation data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Switch
                  id="ignore-exif"
                  checked={transformations.a_ignore || false}
                  onCheckedChange={(checked) => updateTransformation("a_ignore", checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Label htmlFor="angle">Rotation Angle</Label>
                        <Info className="h-4 w-4 ml-1 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rotation angle in degrees (-10000 to 10000)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-gray-500">{transformations.a || "0"}°</span>
              </div>
              <Input
                id="angle"
                type="number"
                min={-10000}
                max={10000}
                value={transformations.a || ""}
                onChange={(e) => updateTransformation("a", e.target.value)}
                placeholder="0"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
