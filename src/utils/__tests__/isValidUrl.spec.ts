import { describe, expect, it } from 'vitest'
import { isValidUrl } from '../isValidUrl'

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://www.google.com')).toBe(true)
    expect(isValidUrl('http://www.example.com/path/to/page.html')).toBe(true)
    expect(isValidUrl('http://127.0.0.1:8080')).toBe(true)
    expect(isValidUrl('https://example.co.uk')).toBe(true)

    // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    expect(isValidUrl('http://example.com/..')).toBe(true)
  })

  it('should return false for invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false)
    expect(isValidUrl('ftp://example.com')).toBe(false)
  })
})
