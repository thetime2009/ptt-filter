export function parseProductImages(imagesField: any): string[] {
  if (!imagesField) return [];
  if (Array.isArray(imagesField)) return imagesField;
  
  const str = String(imagesField).trim();
  if (!str) return [];

  // Try parsing JSON
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'string') {
      // Handle double serialization
      const doubleParsed = JSON.parse(parsed);
      if (Array.isArray(doubleParsed)) return doubleParsed;
    }
  } catch (e) {
    // Ignore and try fallback parsing
  }

  // Handle bracketed non-standard JSON strings
  if (str.startsWith('[') && str.endsWith(']')) {
    try {
      const cleanStr = str.replace(/'/g, '"');
      const parsed = JSON.parse(cleanStr);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }

  // Handle comma-separated URLs
  if (str.includes(',')) {
    return str.split(',').map(url => url.trim()).filter(Boolean);
  }

  // Fallback: return it as a single URL inside array
  return [str];
}
