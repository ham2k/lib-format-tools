import { defaultTranslationImplementation } from './i18n'

describe('defaultTranslationImplementation', () => {
  it('should replace placeholders', () => {
    expect(defaultTranslationImplementation('general.version.general', '{{month}} {{year}}', { month: 'January', year: '2026' })).toEqual('January 2026')
  })
  it('should return the fallback if no placeholders are found', () => {
    expect(defaultTranslationImplementation('general.version.general', 'some {{month}} {{year}} or {{month}} {{other}}', { month: 'January', year: '2026' })).toEqual('some January 2026 or January {{other}}')
  })
})
