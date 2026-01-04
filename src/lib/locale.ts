export function getCurrentLocale (): string {
  if (typeof navigator === 'undefined') return 'en-US'
  else return navigator?.language || 'en-US'
}

