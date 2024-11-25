/**
 * Load an image from a URL.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = e => reject(e)
  })
}

/**
 * Calculate the dimensions of an image given a maximum width and height.
 */
export function calculateDimensions(imgWidth: number, imgHeight: number, maxWidth: number, maxHeight: number) {
  const imgRatio = imgWidth / imgHeight
  const containerRatio = maxWidth / maxHeight

  let newWidth: number
  let newHeight: number

  if (imgRatio > containerRatio) {
    newWidth = maxWidth
    newHeight = maxWidth / imgRatio

    if (newHeight > maxHeight) {
      newHeight = maxHeight
      newWidth = maxHeight * imgRatio
    }
  }
  else {
    newHeight = maxHeight
    newWidth = maxHeight * imgRatio

    if (newWidth > maxWidth) {
      newWidth = maxWidth
      newHeight = maxWidth / imgRatio
    }
  }

  return { height: newHeight, width: newWidth }
}

/**
 * Aborts the given event by stopping its propagation and preventing its default behavior.
 */
export function abortEvent(e: Event | null) {
  if (e == null)
    return

  if (e.stopPropagation)
    e.stopPropagation()

  if (e.preventDefault)
    e.preventDefault()
}
