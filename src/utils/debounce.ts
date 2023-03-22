export function debounce<T>(callback: (...args: any[]) => T | Promise<T>, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: any[]) => {
    clearTimeout(timeoutId)

    return new Promise<T>((resolve) => {
      timeoutId = setTimeout(async () => {
        const result = await callback(...args)
        resolve(result)
      }, wait)
    })
  }
}
