import {
  createCompositeEzAction,
  createJumpToBracketAction,
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
    throw new Error(`Unexpected token after action: ${extraneousToken}`)
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
      // TODO
      return nativeEzAction
    }
    case "pair": {
      return createJumpToBracketAction(true, ">", "<")
    }
    case "toolwindow": {
      // TODO
      return nativeEzAction
    }
    case "numberop": {
      // TODO
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
      actions.push(parseAction(new LexerBuffer(nestedActionString)))
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
