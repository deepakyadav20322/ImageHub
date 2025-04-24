export const SUPPORTED_TRANSFORM_KEYS = [
  "w",
  "h",
  "c",
  "g", // Resize & Crop
  "f",
  "q", // Format & Quality
  "e_grayscale",
  "e_sepia",
  "e_blur",
  "e_negate",
  "e_auto_orient", // Effects
  "a_hflip",
  "a_vflip",
  "a",
  "a_ignore", // Flipping & Rotation
]

export const SUPPORTED_GRAVITY = [
  "center",
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "southeast",
  "southwest",
  "northwest",
]

export function validateTransformations(transformStr: string) {
  if (!transformStr) return { valid: true }

  const transformations = transformStr.split(",")

  for (const t of transformations) {
    const parts = t.split("_")

    // Strict validation - require exact format with underscores
    let baseKey: string
    let value: string

    if (parts.length === 1) {
      // Reject any transformation without underscores (like "a45")
      return {
        valid: false,
        error: `Invalid transformation format: ${t}. Must use underscore syntax (e.g. "a_45")`,
      }
    }

    // Handle both simple (h_450) and prefixed (e_blur) transformations
    baseKey = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : parts[0]

    // Fallback for simple transformations (h_450 becomes "h")
    if (!SUPPORTED_TRANSFORM_KEYS.includes(baseKey)) {
      baseKey = parts[0]
      value = parts.slice(1).join("_")
    } else {
      value = parts.slice(2).join("_")
    }

    if (!SUPPORTED_TRANSFORM_KEYS.includes(baseKey)) {
      return { valid: false, error: `Unsupported transformation key: ${baseKey}` }
    }

    // Strict value validation
    switch (baseKey) {
      case "e_grayscale":
      case "e_sepia":
      case "e_negate":
      case "e_auto_orient":
      case "a_hflip":
      case "a_vflip":
      case "a_ignore":
        if (value) {
          // These shouldn't have values
          return {
            valid: false,
            error: `${baseKey} should not have a value`,
          }
        }
        break

      case "e_blur":
        if (!value) {
          return { valid: false, error: `Blur requires a value` }
        }
        const blurVal = Number.parseFloat(value)
        if (isNaN(blurVal)) {
          return { valid: false, error: `Blur must be a number` }
        }
        if (blurVal < 0.3 || blurVal > 1000) {
          return {
            valid: false,
            error: `Blur must be between 0.3 and 1000`,
          }
        }
        break

      case "w":
      case "h":
        if (!value) {
          return { valid: false, error: `${baseKey} requires a value` }
        }
        const size = Number.parseInt(value, 10)
        if (isNaN(size)) {
          return { valid: false, error: `${baseKey} must be a number` }
        }
        if (size < 1 || size > 5000) {
          return {
            valid: false,
            error: `${baseKey} must be between 1 and 5000`,
          }
        }
        break

      case "q":
        if (!value) {
          return { valid: false, error: `Quality requires a value` }
        }
        const quality = Number.parseInt(value, 10)
        if (isNaN(quality)) {
          return { valid: false, error: `Quality must be a number` }
        }
        if (quality < 1 || quality > 100) {
          return {
            valid: false,
            error: `Quality must be between 1 and 100`,
          }
        }
        break

      case "f":
        if (!value) {
          return { valid: false, error: `Format requires a value` }
        }
        const allowedFormats = ["jpeg", "jpg", "png", "webp", "avif"]
        if (!allowedFormats.includes(value)) {
          return {
            valid: false,
            error: `Unsupported format: ${value}. Allowed: ${allowedFormats.join(", ")}`,
          }
        }
        break

      case "c":
        if (!value) {
          return { valid: false, error: `Crop mode requires a value` }
        }
        const allowedCrops = ["cover", "contain", "fill", "inside", "outside"]
        if (!allowedCrops.includes(value)) {
          return {
            valid: false,
            error: `Unsupported crop mode: ${value}`,
          }
        }
        break

      case "g":
        if (!value) {
          return { valid: false, error: `Gravity requires a value` }
        }
        if (!SUPPORTED_GRAVITY.includes(value)) {
          return {
            valid: false,
            error: `Unsupported gravity: ${value}. Allowed: ${SUPPORTED_GRAVITY.join(", ")}`,
          }
        }
        break

      case "a":
        if (!value) {
          return { valid: false, error: `Angle requires a value` }
        }
        const angle = Number.parseInt(value, 10)
        if (isNaN(angle)) {
          return { valid: false, error: `Angle must be a number` }
        }
        if (!Number.isInteger(angle)) {
          return { valid: false, error: `Angle must be an integer` }
        }
        if (Math.abs(angle) > 10000) {
          return {
            valid: false,
            error: `Angle must be between -10000 and 10000`,
          }
        }
        break
    }
  }

  return { valid: true }
}
