import * as assert from "assert"
import { parseVarString } from "../config/Variables"
import { getMode } from "../mode/ModeState"

suite("Variables", () => {
  test("parseVarString", () => {
    assert.strictEqual(parseVarString("abc"), "abc")
    assert.strictEqual(parseVarString("${space}"), " ")
    assert.strictEqual(parseVarString("abc:${space}"), "abc: ")
    assert.strictEqual(parseVarString("${mode}"), getMode)
  })
})
