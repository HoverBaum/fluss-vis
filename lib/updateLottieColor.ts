/**
 * Updates the fill color in a Lottie JSON animation data.
 *
 * This function takes a Lottie animation JSON object and an RGBA color array,
 * then returns a new Lottie JSON object with all fill (fl) color properties
 * updated to the new color. The color should be provided as an RGBA array where each component
 * is a number between 0 and 1.
 *
 * @param lottieData - The original Lottie JSON data object.
 * @param rgbaColor - The desired color as an RGBA array where each value is between 0 and 1.
 * @returns A new Lottie JSON object with the updated fill colors.
 */
export function updateLottieFillColor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lottieData: any,
  rgbaColor: [number, number, number, number]
): unknown {
  // Create a deep clone of the lottieData to avoid modifying the original JSON.
  // This ensures that the changes are only applied to the new object.
  const updatedData = JSON.parse(JSON.stringify(lottieData))

  // Check if the lottie data contains layers.
  if (Array.isArray(updatedData.layers)) {
    // Iterate over each layer in the Lottie animation.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedData.layers.forEach((layer: any) => {
      // If the layer has a "shapes" array, iterate through each shape.
      if (layer.shapes && Array.isArray(layer.shapes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layer.shapes.forEach((shape: any) => {
          // Check if the shape is a fill layer. In Lottie, fill layers have the type "fl".
          // Also check if the shape has a color property (c.k) that we can update.
          if (shape.ty === 'fl' && shape.c && shape.c.k) {
            // Update the fill color to the new color array.
            shape.c.k = rgbaColor
          }
          // If your Lottie file has nested shapes (e.g., groups), you may need to recursively update them.
        })
      }
    })
  }

  // Return the updated Lottie JSON data with the new fill colors.
  return updatedData
}
