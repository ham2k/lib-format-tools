import { simpleTemplate } from "./string"

type TranslationFunction = (key: string | string[], fallback: string, params?: Record<string, string>) => string

export const defaultTranslationImplementation: TranslationFunction = (_key, fallback, params) => {
  params = params ?? {}

  return simpleTemplate(fallback, params)
}

export const defaultI18N: { t: TranslationFunction } = {
  t: defaultTranslationImplementation
}

export function setTranslationFunction(t: TranslationFunction) {
  defaultI18N.t = t
}

export function getCurrentLocale (): string {
  if (typeof navigator === 'undefined') return 'en-US'
  else return navigator?.language || 'en-US'
}

