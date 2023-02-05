export const buildUrl = (base: string, options: Record<string, string>) => {
  const searchParams = new URLSearchParams(options)

  return new URL(base + "?" + searchParams.toString()).toString()
}
