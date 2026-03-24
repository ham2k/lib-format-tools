import { camelCaseToWords, capitalizeFirstLetter, capitalizeString, countTemplate, escapeToUnicodeEntities, joinAnd, removeASCIIControlCharacters, sanitizeForMarkdown, sanitizeToISO8859, simpleTemplate, slashZeros } from './string'

describe('capitalizeString', () => {
  it('should work', () => {
    expect(capitalizeString('NEW YORK')).toEqual('New York')
    expect(capitalizeString('new york')).toEqual('New York')
    expect(capitalizeString('New York')).toEqual('New York')
    expect(capitalizeString('BEDFORD-STUYVESANT')).toEqual('Bedford-Stuyvesant')
    expect(capitalizeString('I once visited wilkes-barre on a Monday')).toEqual('I Once Visited Wilkes-Barre On A Monday')
    expect(capitalizeString('Member of A.R.E.S.')).toEqual('Member Of A.R.E.S.')
    expect(capitalizeString('Member of ARES')).toEqual('Member Of ARES')
  })

  it('has special handling for names', () => {
    expect(capitalizeString('john m doe')).toEqual('John M Doe')
    expect(capitalizeString('john m doe', { content: 'name' })).toEqual('John M. Doe')
    expect(capitalizeString('john m doe door 2 door', { content: 'name' })).toEqual('John M. Doe Door 2 Door')
    expect(capitalizeString('I once visited BEDFORD-STUYVESANT on a Monday', { content: 'name' })).toEqual('I. Once Visited Bedford-Stuyvesant On A. Monday')
  })

  it('can handle exceptions to the rule', () => {
    expect(capitalizeString('nasa ares flexradio club')).toEqual('NASA ARES FlexRadio Club')
  })

  it('can handle quotes', () => {
    expect(capitalizeString('JOHN "Joe" DOE')).toEqual('John "Joe" Doe')
    expect(capitalizeString('JOHN "JOE" DOE')).toEqual('John "Joe" Doe')
    expect(capitalizeString('john "joe" doe')).toEqual('John "Joe" Doe')
    expect(capitalizeString('JOHN “JOE” DOE')).toEqual('John “Joe” Doe')
  })

  it('can preserve existing case', () => {
    expect(capitalizeString('sullivan county aRES')).toEqual('Sullivan County ARES')
    expect(capitalizeString('Sullivan county aRES', { force: false })).toEqual('Sullivan county aRES')
    expect(capitalizeString('SULLIVAN COUNTY ARES', { force: false })).toEqual('Sullivan County ARES')
    expect(capitalizeString('sullivan county aRES', { force: false })).toEqual('Sullivan County ARES') // Doesn't work if the first letter is not uppercase

    // When not forcing, only add periods to initials if they are already capitalized
    expect(capitalizeString('John P. Smith', { force: false, content: 'name' })).toEqual('John P. Smith')
    expect(capitalizeString('John P Smith', { force: false, content: 'name' })).toEqual('John P. Smith')
    expect(capitalizeString('John p smith', { force: false, content: 'name' })).toEqual('John p smith')
  })
})

describe('capitalizeFirstLetter', () => {
  it('should work', () => {
    expect(capitalizeFirstLetter('new york')).toEqual('New york')
    expect(capitalizeFirstLetter('New York')).toEqual('New York')
    expect(capitalizeFirstLetter('new York')).toEqual('New York')
    expect(capitalizeFirstLetter('NEW YORK')).toEqual('NEW YORK')
  })
})

describe('camelCaseToWords', () => {
  it('should work', () => {
    expect(camelCaseToWords('newYork')).toEqual('new York')
    expect(camelCaseToWords('newYork', { capitalize: true })).toEqual('New York')
    // TODO: Change this test, and code, so it results in "New York ABC"
    expect(camelCaseToWords('newYorkABC', { capitalize: true })).toEqual('New York A B C')
  })
})

describe('simpleTemplate', () => {
  it('should work', () => {
    expect(simpleTemplate('Hello {{name}}', { name: 'John' })).toEqual('Hello John')
    expect(simpleTemplate('Hello {{name}}', { name: () => 'John' })).toEqual('Hello John')
    expect(simpleTemplate('Hello {{name}}', { name: (key, context) => `John ${context.last_name}` }, { last_name: 'Jane' })).toEqual('Hello John Jane')
  })
})

describe('countTemplate', () => {
  it('should work', () => {
    expect(countTemplate(0, { zero: 'No items' })).toEqual('No items')
    expect(countTemplate(1, { one: 'One item' })).toEqual('One item')
    expect(countTemplate(2, { more: '{{count}} items' })).toEqual('2 items')
  })
})

describe('sanitizeToISO8859', () => {
  it('should work', () => {
    expect(sanitizeToISO8859('Hello "World"')).toEqual('Hello "World"')
    expect(sanitizeToISO8859('Hello “World”')).toEqual('Hello "World"')
    expect(sanitizeToISO8859('Hello ‘World’')).toEqual("Hello \'World\'")
    expect(sanitizeToISO8859('Hello ’World’')).toEqual("Hello \'World\'")
  })
})

describe('escapeToUnicodeEntities', () => {
  it('should work', () => {
    expect(escapeToUnicodeEntities('Año')).toEqual('A&#241;o')
  })
})

describe('removeASCIIControlCharacters', () => {
  it('should work', () => {
    expect(removeASCIIControlCharacters('Hello\x00World')).toEqual('HelloWorld')
  })
})

describe('slashZeros', () => {
  it('should work', () => {
    expect(slashZeros('N0TTL')).toEqual('N0̸TTL')
  })
})

describe('sanitizeForMarkdown', () => {
  it('should work', () => {
    expect(sanitizeForMarkdown('* Hello *World*')).toEqual('Hello *World*')
  })
})

describe('joinAnd', () => {
  it('should work', () => {
    expect(joinAnd(['Well', 'Hello', 'World'])).toEqual('Well, Hello and World')
    expect(joinAnd(['Hello', 'World'])).toEqual('Hello and World')
    expect(joinAnd(['Well', 'Hello', 'World'], { separator: '* ', conjunction: ' or ' })).toEqual('Well* Hello or World')
    expect(joinAnd(['Hello', 'World'], { separator: '* ', conjunction: ' or ', final: ' or more ' })).toEqual('Hello or World')
    expect(joinAnd(['Well', 'Hello', 'World'], { separator: '* ', conjunction: ' or ', final: ' or more ' })).toEqual('Well* Hello or more World')
    expect(joinAnd(['Hello', 'World'], { separator: '|', conjunction: '|' })).toEqual('Hello|World')
    expect(joinAnd(['Well', 'Hello', 'World'], { separator: '|', conjunction: '|' })).toEqual('Well|Hello|World')
  })
})
