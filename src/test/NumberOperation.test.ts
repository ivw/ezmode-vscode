import * as assert from "assert"
import { findNumberTextRange } from "../commands/NumberOperation"

test("findNumber", () => {
  const text = "--123-"
  const expectedNrTextRange = [1, 5]

  assert.deepStrictEqual(findNumberTextRange(text, 0), null)
  assert.deepStrictEqual(findNumberTextRange(text, 0), null)
  assert.deepStrictEqual(findNumberTextRange(text, 1), expectedNrTextRange)
  assert.deepStrictEqual(findNumberTextRange(text, 2), expectedNrTextRange)
  assert.deepStrictEqual(findNumberTextRange(text, 3), expectedNrTextRange)
  assert.deepStrictEqual(findNumberTextRange(text, 4), expectedNrTextRange)
  assert.deepStrictEqual(findNumberTextRange(text, 5), expectedNrTextRange)
  assert.deepStrictEqual(findNumberTextRange(text, 6), null)

  assert.deepStrictEqual(findNumberTextRange("-1-1", 2), [2, 4])

  assert.deepStrictEqual(findNumberTextRange("-", 0), null)
})
