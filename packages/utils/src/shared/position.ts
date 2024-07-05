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

export function calcNewImageOffset() {
  // const scaleChange = newZoom / zoomNum.value

  // Current center point of the image
  // const imageCenterPointX = x + getZoomImageSize.value.width / 2
  // const imageCenterPointY = y + getZoomImageSize.value.height / 2
  // const newImageCenterX = (imageCenterPointX - targetPoint.x) * scaleChange + targetPoint.x
  // const newImageCenterY = (imageCenterPointY - targetPoint.y) * scaleChange + targetPoint.y
}
