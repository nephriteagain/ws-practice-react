import { expect, describe, it } from 'vitest'


function sum(a: number,b: number) {
  if (a == undefined || b == undefined) {
    throw new Error('missing parameter/s')
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('invalid params')
  }
  return a + b
}


describe('a function that adds two number', () => {
  it('should be a typeof number', () => {
    const total = sum(100, 10)
    expect(total).toBeTypeOf('number')
  })
  it('should throw an error', () => {
    // const error = sum('dog', 10)
    expect(() => sum('dog', 10)).toThrowError('invalid params')
  })
  it('should throw an eror', () => {
    expect(() => sum(1)).toThrowError('missing parameter/s')
  })
})

