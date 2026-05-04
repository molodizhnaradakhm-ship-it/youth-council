/**
 * Wraps a URL for use in CSS `url(...)`.
 * Unquoted URLs break when the value contains `)`, spaces, `&`, etc.
 */
export function cssUrl(value: string): string {
  const escaped = String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `url("${escaped}")`;
}
