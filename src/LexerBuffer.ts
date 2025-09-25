function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r"
}

export class LexerBuffer {
  readonly content: string
  start: number
  end: number

  constructor(content: string, start: number = 0, end: number = content.length) {
    this.content = content
    this.start = start
    this.end = end
  }

  skipWhitespace(): void {
    while (this.start < this.end && isWhitespace(this.content[this.start])) {
      this.start++
    }
  }

  nextChar(): string | null {
    if (this.start >= this.end) {
      return null
    }
    return this.content[this.start++]
  }

  nextToken(): string | null {
    this.skipWhitespace()
    if (this.start >= this.end) {
      return null
    }
    const tokenStart = this.start
    while (this.start < this.end && !isWhitespace(this.content[this.start])) {
      this.start++
    }
    return this.content.substring(tokenStart, this.start)
  }

  until(untilChar: string): string | null {
    const start = this.start
    while (this.start < this.end) {
      const char = this.content[this.start++]
      if (char === untilChar) {
        return this.content.substring(start, this.start - 1)
      }
    }
    return null
  }

  /**
   * Assumes the opening bracket has already been consumed.
   */
  untilClosingBracket(closingBracket: string, openingBracket: string): string | null {
    const start = this.start
    let depth = 0
    while (this.start < this.end) {
      const char = this.content[this.start++]
      if (char === closingBracket) {
        if (depth === 0) {
          return this.content.substring(start, this.start - 1)
        }
        depth--
      } else if (char === openingBracket) {
        depth++
      }
    }
    return null
  }

  remainingContent(): string | null {
    this.skipWhitespace()
    if (this.start >= this.end) {
      return null
    }
    const remaining = this.content.substring(this.start, this.end)
    this.start = this.end
    return remaining
  }
}
