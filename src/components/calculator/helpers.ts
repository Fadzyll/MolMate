export const cardClass =
  'min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'

/** Copy text and flash a "copied" state for 1.5 s. */
export async function copyText(text: string, setCopied: (v: boolean) => void) {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  } catch {
    // Clipboard blocked; nothing else to do.
  }
}
