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
