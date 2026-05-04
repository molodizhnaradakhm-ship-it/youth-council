export function hasLexicalContent(content: unknown): boolean {
  if (!content || typeof content !== 'object' || !('root' in content)) {
    return false;
  }

  const root = (content as { root?: { children?: unknown[] } }).root;

  return Boolean(root?.children?.length);
}
