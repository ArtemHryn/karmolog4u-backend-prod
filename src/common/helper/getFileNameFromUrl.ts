export function getFileNameFromUrl(url: string): string {
  const parts = url.split('/'); // Split by "/"
  return parts[parts.length - 1]; // Get the last part (filename)
}
