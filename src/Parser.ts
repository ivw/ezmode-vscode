import {
  createCompositeEzAction,
  createKeyReferenceAction,
  createMapKeyBindingAction,
  createPopupAction,
  createSetVarAction,
  createSwitchModeAction,
  createVsCodeEzAction,
  createWriteAction,
  nativeEzAction,
  type EzAction,
} from "./EzAction"

// best approach:
/*
lex per character
for every char, skip whitespace and comments.

split in lines,
then process line comments,
  find first occurence of //
then parse.
  use whitespace as delimiter.
*/

function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r"
}

export class LexerBuffer {
  readonly content: string
  private start: number
  private readonly end: number

  constructor(content: string) {
    this.content = content
    this.start = 0
    this.end = content.length
  }

  skipWhitespace(): void {
    while (this.start < this.end && isWhitespace(this.content[this.start])) {
      this.start++
    }
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

  remainingContent(): string {
    this.skipWhitespace()
    if (this.start >= this.end) {
      return ""
    }
    const remaining = this.content.substring(this.start, this.end)
    this.start = this.end
    return remaining
  }
}

export class Scanner {
  readonly content: string
  private position: number

  constructor(content: string) {
    this.content = content
    this.position = 0
  }

  peek(): string | null {
    return this.isAtEnd() ? null : this.content[this.position]
  }

  next(): string | null {
    return this.isAtEnd() ? null : this.content[this.position++]
  }

  nextWord(): string | null {
    if (this.isAtEnd()) {
      return null
    }
    this.skipWhitespace()
    return this.untilWhitespace()
  }

  until(target: string): string | null {
    const start = this.position
    const i = this.content.indexOf(target, start)
    if (i === -1) {
      return null
    }
    this.position = i + target.length
    return this.content.substring(start, i)
  }

  untilWhitespace(): string | null {
    if (this.isAtEnd()) {
      return null
    }
    const start = this.position
    while (!this.isAtEnd() && !this.isWhitespace(this.peek()!)) {
      this.next()
    }
    if (this.position === start) {
      return null
    }
    return this.content.substring(start, this.position)
  }

  remainingContent(): string {
    const start = this.position
    this.position = this.content.length
    return this.content.substring(start)
  }

  isAtEnd(): boolean {
    return this.position >= this.content.length
  }

  skipWhitespace(): void {
    while (!this.isAtEnd() && this.isWhitespace(this.peek()!)) {
      this.next()
    }
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char)
  }
}

export function parseEzModeRc(content: string): Array<EzAction> {
  const actions: Array<EzAction> = []
  content.split("\n").forEach((line) => {
    const action = parseLine(line)
    if (action !== null) {
      actions.push(action)
    }
  })
  return actions
}

export function parseLine(line: string): EzAction | null {
  const commentIndex = line.indexOf("//")
  if (commentIndex !== -1) {
    line = line.substring(0, commentIndex)
  }

  line = line.trim()
  if (line.length === 0) {
    return null
  }
  return parseAction(new Scanner(line), false)
}

export function parseAction(scanner: Scanner, isNestedAction: boolean): EzAction {
  const getRemainingContent = () => {
    return isNestedAction ? scanner.until(">") : scanner.remainingContent()
  }
  console.log("12345")
  console.log(scanner.content)

  const actionType = scanner.until(" ")
  switch (actionType) {
    case "mode": {
      const modeName = getRemainingContent()
      if (modeName === null) {
        throw new Error("Expected mode name")
      }
      return createSwitchModeAction(modeName)
    }
    case "vscode": {
      const commandId = getRemainingContent()
      if (commandId === null) {
        throw new Error("Expected command ID")
      }
      return createVsCodeEzAction(commandId)
    }
    case "write": {
      const text = getRemainingContent()
      if (text === null) {
        throw new Error("Expected text to write")
      }
      return createWriteAction(text)
    }
    case "popup": {
      const message = getRemainingContent()
      if (message === null) {
        throw new Error("Expected popup message")
      }
      return createPopupAction(message)
    }
    case "native": {
      return nativeEzAction
    }
    case "set": {
      const varName = scanner.until(" ")
      if (varName === null) {
        throw new Error("Expected variable name for set action")
      }
      const value = getRemainingContent()
      if (value === null) {
        throw new Error("Expected value for set action")
      }
      return createSetVarAction(varName, value)
    }
    case "map": {
      const modeName = scanner.until(" ")
      if (modeName === null) {
        throw new Error("Expected mode name for map action")
      }
      const key = scanner.until(" ")
      if (key === null) {
        throw new Error("Expected key for map action")
      }
      const actionChainString = getRemainingContent()
      if (actionChainString === null) {
        throw new Error("Expected action for map action")
      }
      const action = parseActionChain(actionChainString)
      return createMapKeyBindingAction(modeName, { key, action })
    }
    default: {
      throw new Error(`Unknown action type: ${actionType}`)
    }
  }
}

export function parseActionChain(actionChainString: string): EzAction {
  const scanner = new Scanner(actionChainString)
  const actions: Array<EzAction> = []
  while (!scanner.isAtEnd()) {
    const firstChar = scanner.next()
    if (firstChar === "<") {
      actions.push(parseAction(scanner, true))
    } else {
      actions.push(createKeyReferenceAction(firstChar!))
    }
  }
  if (actions.length === 0) {
    throw new Error("Empty action chain")
  }
  if (actions.length === 1) {
    return actions[0]
  }
  return createCompositeEzAction(actions)
}
