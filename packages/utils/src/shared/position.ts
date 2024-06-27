/**
 * Calculate the offset required to center the image on the canvas.
 */
export function centerOffset(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
) {
  let offsetX = 0
  let offsetY = 0

  offsetX = (canvasWidth - imageWidth) / 2
  offsetY = (canvasHeight - imageHeight) / 2

  return { offsetX, offsetY }
}
