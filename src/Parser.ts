import type { Delim } from "./delim/Delim"
import { pairDelim, pairDelims } from "./delim/PairDelim"
import { quoteDelim } from "./delim/QuoteDelim"
import {
  createCompositeEzAction,
  createJumpToBracketAction,
  createJumpToQuoteAction,
  createKeyReferenceAction,
  createMapKeyBindingAction,
  createOfModeAction,
  createPopupAction,
  createSetVarAction,
  createSwitchModeAction,
  createVsCodeEzAction,
  createWriteAction,
  nativeEzAction,
  type EzAction,
} from "./EzAction"
import { LexerBuffer } from "./LexerBuffer"

export function parseEzModeRc(content: string): Array<EzAction> {
  const actions: Array<EzAction> = []
  content.split("\n").forEach((line, lineIndex) => {
    try {
      const action = parseLine(line)
      if (action !== null) {
        actions.push(action)
      }
    } catch (e) {
      if (!(e instanceof Error)) throw e

      throw new Error(`Error parsing line ${lineIndex + 1}: ${e.message}`)
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
  if (line === "") {
    return null
  }

  const buf = new LexerBuffer(line)
  const action = parseAction(buf)
  const extraneousToken = buf.nextToken()
  if (extraneousToken !== null) {
    throw new Error(`Unexpected token: ${extraneousToken}`)
  }
  return action
}

const keyBindingKeyMap: Record<string, string> = {
  lt: "<",
  gt: ">",
  space: " ",
  enter: "\n",
}

export function parseAction(buf: LexerBuffer): EzAction {
  const actionType = buf.nextToken()
  switch (actionType) {
    case "mode": {
      const modeName = buf.remainingContent()
      if (modeName === null) {
        throw new Error("Expected mode name")
      }
      return createSwitchModeAction(modeName)
    }
    case "vscode": {
      const commandId = buf.nextToken()
      if (commandId === null) {
        throw new Error("Expected command ID")
      }
      let args = buf.remainingContent()
      if (args !== null) {
        try {
          args = JSON.parse(args)
        } catch {
          // Leave as string if not valid JSON
        }
      }
      return createVsCodeEzAction(commandId, args)
    }
    case "write": {
      const text = buf.remainingContent()
      if (text === null) {
        throw new Error("Expected text to write")
      }
      return createWriteAction(text)
    }
    case "popup": {
      const message = buf.remainingContent()
      if (message === null) {
        throw new Error("Expected popup message")
      }
      return createPopupAction(message)
    }
    case "native": {
      return nativeEzAction
    }
    case "set": {
      const varName = buf.nextToken()
      if (varName === null) {
        throw new Error("Expected variable name for set action")
      }
      const value = buf.remainingContent()
      if (value === null) {
        throw new Error("Expected value for set action")
      }
      return createSetVarAction(varName, value)
    }
    case "map": {
      const modeName = buf.nextToken()
      if (modeName === null) {
        throw new Error("Expected mode name for map action")
      }
      let key = buf.nextToken()
      if (key === null) {
        throw new Error("Expected key for map action")
      }
      key = keyBindingKeyMap[key] ?? key

      const actionChainString = buf.remainingContent()
      if (actionChainString === null) {
        throw new Error("Expected action for `map`")
      }
      const action = parseActionChain(actionChainString)
      return createMapKeyBindingAction(modeName, { key, action })
    }
    case "ofmode": {
      const mode = buf.remainingContent()
      if (mode === null) {
        throw new Error("Expected mode for ofmode action")
      }
      return createOfModeAction(mode)
    }
    case "quote": {
      buf.skipWhitespace()
      const char = buf.nextChar()
      if (char === null) {
        throw new Error("Expected character for quote action")
      }
      return createJumpToQuoteAction(quoteDelim(char))
    }
    case "pair": {
      function parseShouldFindClosingDelim() {
        const direction = buf.nextToken()
        if (direction === "open") {
          return false
        }
        if (direction === "close") {
          return true
        }
        throw new Error("First argument of `pair` must be open or close")
      }
      function parseDelimString(): Delim {
        const delimString = buf.nextToken()
        if (delimString === null) {
          throw new Error("Second argument of `pair` must be a delimiter")
        }
        if (delimString === "angle") {
          return pairDelims.angle
        }
        if (delimString.length !== 2) {
          throw new Error("Second argument of `pair` must be 2 characters")
        }
        const openChar = delimString.charAt(0)
        const closeChar = delimString.charAt(1)
        if (openChar === closeChar) {
          throw new Error("Second argument of `pair` must be 2 different characters")
        }
        return pairDelim(openChar, closeChar)
      }
      return createJumpToBracketAction(parseShouldFindClosingDelim(), parseDelimString())
    }
    case "toolwindow": {
      // TODO
      buf.remainingContent()
      return nativeEzAction
    }
    case "numberop": {
      // TODO
      buf.remainingContent()
      return nativeEzAction
    }
    default: {
      throw new Error(`Unknown action type: ${actionType}`)
    }
  }
}

export function parseActionChain(actionChainString: string): EzAction {
  const buf = new LexerBuffer(actionChainString)
  const actions: Array<EzAction> = []

  let char: string | null = buf.nextChar()
  while (char !== null) {
    if (char === "<") {
      const nestedActionString = buf.untilClosingBracket(">", "<")
      if (nestedActionString === null) {
        throw new Error("Expected closing '>'")
      }
      const nestedActionBuf = new LexerBuffer(nestedActionString)
      const nestedAction = parseAction(nestedActionBuf)
      const extraneousToken = nestedActionBuf.nextToken()
      if (extraneousToken !== null) {
        throw new Error(`Unexpected token: ${extraneousToken}`)
      }
      actions.push(nestedAction)
    } else {
      actions.push(createKeyReferenceAction(char))
    }
    char = buf.nextChar()
  }
  if (actions.length === 0) {
    throw new Error("Empty action chain")
  }
  if (actions.length === 1) {
    return actions[0]
  }
  return createCompositeEzAction(actions)
}
