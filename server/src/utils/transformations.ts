// export const SUPPORTED_TRANSFORM_KEYS = [
//     // Resize & Crop
//     "w", "h", "c", "g",
  
//     // Format & Quality
//     "f", "q",
  
//     // Effects
//     "e_grayscale",
//     "e_sepia",
//     "e_blur",
//     "e_negate",
//     "e_auto_orient",
  
//     // Flipping & Rotation
//     "a_hflip",
//     "a_vflip",
//     "a",         // a_<angle> like a_90 or a_-30
//     "a_ignore"
//   ];
  
//   export const SUPPORTED_GRAVITY = [
//     "center", "north", "south", "east", "west",
//     "northeast", "southeast", "southwest", "northwest",
//   ];


// export function validateTransformations(transformStr: string) {
//   const transformations = transformStr.split(",");

//   for (const t of transformations) {
//     const [key, value] = t.split("_");

//     if (!SUPPORTED_TRANSFORM_KEYS.includes(key)) {
//       return { valid: false, error: `Unsupported transformation key: ${key}` };
//     }

//     if (["w", "h"].includes(key)) {
//       const num = parseInt(value, 10);
//       if (isNaN(num) || num < 1 || num > 5000) {
//         return { valid: false, error: `${key} must be a number between 1 and 5000` };
//       }
//     }

//     if (key === "q") {
//       const num = parseInt(value, 10);
//       if (isNaN(num) || num < 1 || num > 100) {
//         return { valid: false, error: `Quality must be between 1–100` };
//       }
//     }

//     if (key === "f" && !["jpeg", "jpg", "png", "webp", "avif"].includes(value)) {
//       return { valid: false, error: `Unsupported format: ${value}` };
//     }

//     if (key === "c" && !["cover", "contain", "fill", "inside", "outside"].includes(value)) {
//       return { valid: false, error: `Unsupported crop mode: ${value}` };
//     }

//     if (key === "g" && !SUPPORTED_GRAVITY.includes(value)) {
//       return { valid: false, error: `Unsupported gravity: ${value}` };
//     }

//     if (key === "a") {
//       const angle = parseInt(value, 10);
//       if (isNaN(angle) || angle < -360 || angle > 360) {
//         return { valid: false, error: `Angle (a) must be between -360 and +360` };
//       }
//     }
//   }

//   return { valid: true };
// }
// --------------------------------------------------------------------------------



// export const SUPPORTED_TRANSFORM_KEYS = [
//     "w", "h", "c", "g",        // Resize & Crop
//     "f", "q",                  // Format & Quality
//     "e_grayscale", "e_sepia", "e_blur", "e_negate", "e_auto_orient", // Effects
//     "a_hflip", "a_vflip", "a", "a_ignore"  // Flipping & Rotation
//   ];
  
//   export const SUPPORTED_GRAVITY = [
//     "center", "north", "south", "east", "west",
//     "northeast", "southeast", "southwest", "northwest",
//   ];
  
//   export function validateTransformations(transformStr: string) {
//     if (!transformStr) return { valid: true };
  
//     const transformations = transformStr.split(",");
  
//     for (const t of transformations) {
//       const [key, ...rest] = t.split("_");
//       const value = rest.join("_");
  
//       if (!SUPPORTED_TRANSFORM_KEYS.includes(key) && !SUPPORTED_TRANSFORM_KEYS.includes(`${key}_${value}`)) {
//         return { valid: false, error: `Unsupported transformation key: ${t}` };
//       }
  
//       switch (key) {
//         case "w":
//         case "h": {
//           const num = parseInt(value, 10);
//           if (isNaN(num) || num < 1 || num > 5000) {
//             return { valid: false, error: `${key} must be a number between 1 and 5000` };
//           }
//           break;
//         }
  
//         case "q": {
//           const num = parseInt(value, 10);
//           if (isNaN(num)) {
//             return { valid: false, error: `Quality must be a number` };
//           }
//           if (num < 1) {
//             return { valid: false, error: `Quality must be at least 1` };
//           }
//           // Allow values > 100, will clamp later
//           break;
//         }
  
//         case "f": {
//           const allowedFormats = ["jpeg", "jpg", "png", "webp", "avif"];
//           if (!allowedFormats.includes(value)) {
//             return { valid: false, error: `Unsupported format: ${value}` };
//           }
//           break;
//         }
  
//         case "c": {
//           const allowedCrop = ["cover", "contain", "fill", "inside", "outside"];
//           if (!allowedCrop.includes(value)) {
//             return { valid: false, error: `Unsupported crop mode: ${value}` };
//           }
//           break;
//         }
  
//         case "g": {
//           if (!SUPPORTED_GRAVITY.includes(value)) {
//             return { valid: false, error: `Unsupported gravity: ${value}` };
//           }
//           break;
//         }
  
//         case "a": {
//             if (!value) {
//               return { valid: false, error: `Angle (a) is required, e.g. a_90` };
//             }
          
//             const angle = Number(value);
          
//             if (!Number.isInteger(angle)) {
//               return { valid: false, error: `Angle must be an integer` };
//             }
          
//             if (!isFinite(angle)) {
//               return { valid: false, error: `Angle must be a finite number` };
//             }
          
//             // Normalize angle to be within -360 to 360 (optional for UI clarity)
//             const normalized = ((angle % 360) + 360) % 360;
          
//             // Optional: set max limit for extreme inputs
//             if (Math.abs(angle) > 10000) {
//               return { valid: false, error: `Angle value too large: ${angle}` };
//             }
          
//             break;
//           }
          
  
//         case "e": {
//           const effect = value;
//           const allowedEffects = ["grayscale", "sepia", "blur", "negate", "auto_orient"];
//           if (!allowedEffects.includes(effect)) {
//             return { valid: false, error: `Unsupported effect: ${effect}` };
//           }
//           break;
//         }
  
//         case "a_hflip":
//         case "a_vflip":
//         case "a_ignore":
//           // no value required
//           break;
  
//         case "e_blur": {
//           if (!value) break; // default blur
//           const num = parseFloat(value);
//           if (isNaN(num) || num < 0.3 || num > 1000) {
//             return { valid: false, error: `Blur must be a number between 0.3 and 1000` };
//           }
//           break;
//         }
  
//         default:
//           break;
//       }
//     }
  
//     return { valid: true };
//   }
  


export const SUPPORTED_TRANSFORM_KEYS = [
    "w", "h", "c", "g",        // Resize & Crop
    "f", "q",                  // Format & Quality
    "e_grayscale", "e_sepia", "e_blur", "e_negate", "e_auto_orient", // Effects
    "a_hflip", "a_vflip", "a", "a_ignore"  // Flipping & Rotation
  ];
  
  export const SUPPORTED_GRAVITY = [
    "center", "north", "south", "east", "west",
    "northeast", "southeast", "southwest", "northwest",
  ];
  
  export function validateTransformations(transformStr: string) {
    if (!transformStr) return { valid: true };
  
    const transformations = transformStr.split(",");
  
    for (const t of transformations) {
      const parts = t.split("_");
      const baseKey = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : parts[0];
      const value = parts.slice(2).join("_");
  
      if (!SUPPORTED_TRANSFORM_KEYS.includes(baseKey)) {
        return { valid: false, error: `Unsupported transformation key: ${baseKey}` };
      }
  
      switch (baseKey) {
        case "e_grayscale":
        case "e_sepia":
        case "e_negate":
        case "e_auto_orient":
        case "a_hflip":
        case "a_vflip":
        case "a_ignore":
          break; // no validation needed
  
        case "e_blur": {
          if (!value) break;
          const blurVal = parseFloat(value);
          if (isNaN(blurVal) || blurVal < 0.3 || blurVal > 1000) {
            return { valid: false, error: `Blur must be a number between 0.3 and 1000` };
          }
          break;
        }
  
        case "w":
        case "h": {
          const num = parseInt(parts[1], 10);
          if (isNaN(num) || num < 1 || num > 5000) {
            return { valid: false, error: `${baseKey} must be between 1 and 5000` };
          }
          break;
        }
  
        case "q": {
          const num = parseInt(parts[1], 10);
          if (isNaN(num) || num < 1) {
            return { valid: false, error: `Quality must be at least 1` };
          }
          break;
        }
  
        case "f": {
          const allowed = ["jpeg", "jpg", "png", "webp", "avif"];
          if (!allowed.includes(parts[1])) {
            return { valid: false, error: `Unsupported format: ${parts[1]}` };
          }
          break;
        }
  
        case "c": {
          const allowed = ["cover", "contain", "fill", "inside", "outside"];
          if (!allowed.includes(parts[1])) {
            return { valid: false, error: `Unsupported crop mode: ${parts[1]}` };
          }
          break;
        }
  
        case "g": {
          if (!SUPPORTED_GRAVITY.includes(parts[1])) {
            return { valid: false, error: `Unsupported gravity: ${parts[1]}` };
          }
          break;
        }
  
        case "a": {
          const angle = Number(parts[1]);
          if (!Number.isInteger(angle) || !isFinite(angle) || Math.abs(angle) > 10000) {
            return { valid: false, error: `Invalid angle: ${parts[1]}` };
          }
          break;
        }
      }
    }
  
    return { valid: true };
  }
  
  

 