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

// ==========================================================================================

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
//    console.log("transformations",transformations)
//     for (const t of transformations) {
//       const parts = t.split("_");
//       const baseKey = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : parts[0];
//       const value = parts.slice(2).join("_");

//       if (!SUPPORTED_TRANSFORM_KEYS.includes(baseKey)) {
//         return { valid: false, error: `Unsupported transformation key: ${baseKey}` };
//       }

//       switch (baseKey) {
//         case "e_grayscale":
//         case "e_sepia":
//         case "e_negate":
//         case "e_auto_orient":
//         case "a_hflip":
//         case "a_vflip":
//         case "a_ignore":
//           break; // no validation needed

//         case "e_blur": {
//           if (!value) break;
//           const blurVal = parseFloat(value);
//           if (isNaN(blurVal) || blurVal < 0.3 || blurVal > 1000) {
//             return { valid: false, error: `Blur must be a number between 0.3 and 1000` };
//           }
//           break;
//         }

//         case "w":
//         case "h": {
//           const num = parseInt(parts[1], 10);
//           if (isNaN(num) || num < 1 || num > 5000) {
//             return { valid: false, error: `${baseKey} must be between 1 and 5000` };
//           }
//           break;
//         }

//         case "q": {
//           const num = parseInt(parts[1], 10);
//           if (isNaN(num) || num < 1) {
//             return { valid: false, error: `Quality must be at least 1` };
//           }
//           break;
//         }

//         case "f": {
//           const allowed = ["jpeg", "jpg", "png", "webp", "avif"];
//           if (!allowed.includes(parts[1])) {
//             return { valid: false, error: `Unsupported format: ${parts[1]}` };
//           }
//           break;
//         }

//         case "c": {
//           const allowed = ["cover", "contain", "fill", "inside", "outside"];
//           if (!allowed.includes(parts[1])) {
//             return { valid: false, error: `Unsupported crop mode: ${parts[1]}` };
//           }
//           break;
//         }

//         case "g": {
//           if (!SUPPORTED_GRAVITY.includes(parts[1])) {
//             return { valid: false, error: `Unsupported gravity: ${parts[1]}` };
//           }
//           break;
//         }

//         case "a": {
//           const angle = Number(parts[1]);
//           if (!Number.isInteger(angle) || !isFinite(angle) || Math.abs(angle) > 10000) {
//             return { valid: false, error: `Invalid angle: ${parts[1]}` };
//           }
//           break;
//         }
//       }
//     }

//     return { valid: true };
//   }

// ===========================================

export const SUPPORTED_TRANSFORM_KEYS = [
    "w", "h", "c", "g",        // Resize & Crop
    "f", "q",                  // Format & Quality
    "e_grayscale", "e_sepia", "e_blur", "e_negate", "e_auto_orient", // Effects
    "a_hflip", "a_vflip", "a", "a_ignore",  // Flipping & Rotation
    "b", "bc",                    // Border & Border Color
    "r"                             // Border Radius
];

export const SUPPORTED_GRAVITY = [
    "center", "north", "south", "east", "west",
    "northeast", "southeast", "southwest", "northwest",
];

const MAX_BORDER = 100
const MAX_RADIUS = 4000

export function validateTransformations(transformStr: string) {
    if (!transformStr) return { valid: true };

    const transformations = transformStr.split(",");

    for (const t of transformations) {
        const parts = t.split("_");

        // Strict validation - require exact format with underscores
        let baseKey: string;
        let value: string;

        if (parts.length === 1) {
            // Reject any transformation without underscores (like "a45")
            return {
                valid: false,
                error: `Invalid transformation format: ${t}. Must use underscore syntax (e.g. "a_45")`
            };
        }

        // Handle both simple (h_450) and prefixed (e_blur) transformations
        baseKey = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : parts[0];

        // Fallback for simple transformations (h_450 becomes "h")
        if (!SUPPORTED_TRANSFORM_KEYS.includes(baseKey)) {
            baseKey = parts[0];
            value = parts.slice(1).join("_");
        } else {
            value = parts.slice(2).join("_");
        }

        if (!SUPPORTED_TRANSFORM_KEYS.includes(baseKey)) {
            return { valid: false, error: `Unsupported transformation key: ${baseKey}` };
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
                if (value) {  // These shouldn't have values
                    return {
                        valid: false,
                        error: `${baseKey} should not have a value`
                    };
                }
                break;

            case "e_blur":
                if (!value) {
                    return { valid: false, error: `Blur requires a value` };
                }
                const blurVal = parseFloat(value);
                if (isNaN(blurVal)) {
                    return { valid: false, error: `Blur must be a number` };
                }
                if (blurVal < 0.3 || blurVal > 1000) {
                    return {
                        valid: false,
                        error: `Blur must be between 0.3 and 1000`
                    };
                }
                break;

            case "w":
            case "h":
                if (!value) {
                    return { valid: false, error: `${baseKey} requires a value` };
                }
                const size = parseInt(value, 10);
                if (isNaN(size)) {
                    return { valid: false, error: `${baseKey} must be a number` };
                }
                if (size < 1 || size > 5000) {
                    return {
                        valid: false,
                        error: `${baseKey} must be between 1 and 5000`
                    };
                }
                break;

            case "q":
                if (!value) {
                    return { valid: false, error: `Quality requires a value` };
                }
                const quality = parseInt(value, 10);
                if (isNaN(quality)) {
                    return { valid: false, error: `Quality must be a number` };
                }
                if (quality < 1 || quality > 100) {
                    return {
                        valid: false,
                        error: `Quality must be between 1 and 100`
                    };
                }
                break;

            case "f":
                if (!value) {
                    return { valid: false, error: `Format requires a value` };
                }
                const allowedFormats = ["jpeg", "jpg", "png", "webp", "avif"];
                if (!allowedFormats.includes(value)) {
                    return {
                        valid: false,
                        error: `Unsupported format: ${value}. Allowed: ${allowedFormats.join(", ")}`
                    };
                }
                break;

            case "c":
                if (!value) {
                    return { valid: false, error: `Crop mode requires a value` };
                }
                const allowedCrops = ["cover", "contain", "fill", "inside", "outside"];
                if (!allowedCrops.includes(value)) {
                    return {
                        valid: false,
                        error: `Unsupported crop mode: ${value}`
                    };
                }
                break;

            case "g":
                if (!value) {
                    return { valid: false, error: `Gravity requires a value` };
                }
                if (!SUPPORTED_GRAVITY.includes(value)) {
                    return {
                        valid: false,
                        error: `Unsupported gravity: ${value}. Allowed: ${SUPPORTED_GRAVITY.join(", ")}`
                    };
                }
                break;

            case "a":
                if (!value) {
                    return { valid: false, error: `Angle requires a value` };
                }
                const angle = parseInt(value, 10);
                if (isNaN(angle)) {
                    return { valid: false, error: `Angle must be a number` };
                }
                if (!Number.isInteger(angle)) {
                    return { valid: false, error: `Angle must be an integer` };
                }
                if (Math.abs(angle) > 10000) {
                    return {
                        valid: false,
                        error: `Angle must be between -10000 and 10000`
                    };
                }
                break;


            case "b":
                if (!value) return { valid: false, error: `Border requires a value` };
                const border = parseInt(value, 10);
                if (isNaN(border)) return { valid: false, error: `Border must be a number` };
                if (border < 1 || border > MAX_BORDER) {
                    return { valid: false, error: `Border must be between 1 and ${MAX_BORDER}` };
                }
                break;

            case "bc":
                if (!value) return { valid: false, error: `Border color requires a value` };
                const hexRegex = /^[0-9a-fA-F]{3,8}$/;
                if (!hexRegex.test(value)) {
                    return { valid: false, error: `Border color must be a valid hex value without "#" (3, 4, 6, or 8 hex chars)` };
                }
                break;

            // Validate the radius transformation (r or r_max)
            case "r":
                if (!value) return { valid: false, error: `Radius requires a value` };

                if (value === "max") {
                    // If the value is 'max', allow it as a valid input
                    return { valid: true };
                }

                // If the value is a number, parse it and check if it's within the valid range
                const b_radius = parseInt(value, 10);
                if (isNaN(b_radius)) {
                    return { valid: false, error: `border Radius must be a number or 'max'` };
                }

                // Validate that the radius is within the valid range
                if (b_radius < 1 || b_radius > MAX_RADIUS) {
                    return { valid: false, error: `border radius must be between 1 and ${MAX_RADIUS}` };
                }

                return { valid: true };  // If everything is valid



        }
    }


    return { valid: true };
}
// =============================
