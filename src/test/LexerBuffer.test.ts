import * as assert from "assert"
import { LexerBuffer } from "../config/LexerBuffer"

suite("LexerBuffer", () => {
  test("nextToken", () => {
    const lexer = new LexerBuffer("  hello   world  ")
    assert.strictEqual(lexer.nextToken(), "hello")
    assert.strictEqual(lexer.nextToken(), "world")
    assert.strictEqual(lexer.nextToken(), null)
  })

  test("until", () => {
    const lexer = new LexerBuffer("  hello> world  ")
    assert.strictEqual(lexer.until(">"), "  hello")
    assert.strictEqual(lexer.nextToken(), "world")
    assert.strictEqual(lexer.nextToken(), null)
  })

  test("untilClosingBracket", () => {
    const lexer = new LexerBuffer("<hello <nested>> world  ")
    assert.strictEqual(lexer.nextChar(), "<")
    assert.strictEqual(lexer.untilClosingBracket(">", "<"), "hello <nested>")
    assert.strictEqual(lexer.nextToken(), "world")
    assert.strictEqual(lexer.nextToken(), null)
  })

  test("untilClosingBracket with missing closing bracket", () => {
    const lexer = new LexerBuffer("<hello <nested>")
    assert.strictEqual(lexer.nextChar(), "<")
    assert.strictEqual(lexer.untilClosingBracket(">", "<"), null)
    assert.strictEqual(lexer.nextToken(), null)
  })

  test("remainingContent", () => {
    const lexer = new LexerBuffer("  some remaining content  ")
    assert.strictEqual(lexer.remainingContent(), "some remaining content  ")
    assert.strictEqual(lexer.remainingContent(), null)
  })
})
