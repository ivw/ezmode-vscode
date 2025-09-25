import * as vscode from "vscode"
import { getOrAddModeEnv, getActionForKey, type EzEnv, type KeyBinding } from "./EzEnv"
import { getMode, switchMode } from "./ModeState"
import { changeCursorColor, resetCursorColor } from "./CursorColor"

export type EzEvent = {
  env: EzEnv
  key: string | null
}

export type EzAction = {
  perform: (e: EzEvent) => unknown
  description: string
}

export function createSwitchModeAction(mode: string): EzAction {
  return {
    perform: () => {
      switchMode(mode)
    },
    description: `Switch mode to: ${mode}`,
  }
}

export function createVsCodeEzAction(commandId: string, args: unknown): EzAction {
  return {
    perform: () => {
      console.log(`Executing VSCode command: ${commandId} with args: ${JSON.stringify(args)}`)
      return vscode.commands.executeCommand(commandId, args)
    },
    description: `Command: ${commandId}${args !== null ? `, args: ${JSON.stringify(args)}` : ""}`,
  }
}

export const nativeEzAction: EzAction = {
  perform: (e) => {
    return vscode.commands.executeCommand("default:type", { text: e.key })
  },
  description: "Native",
}

export function createWriteAction(message: string): EzAction {
  return {
    perform: () => {
      // TODO
    },
    description: `Write: ${message}`,
  }
}

export function createPopupAction(message: string): EzAction {
  return {
    perform: () => {
      vscode.window.showInformationMessage(message)
    },
    description: `Display notification: ${message}`,
  }
}

export function createCursorColorAction(color: string): EzAction {
  return {
    perform: () => {
      if (color === "default") {
        resetCursorColor()
      } else {
        changeCursorColor(color)
      }
    },
    description: `Change cursor color to ${color}`,
  }
}

export function createMapKeyBindingAction(mode: string, keyBinding: KeyBinding): EzAction {
  return {
    perform: (e) => {
      const modeEnv = getOrAddModeEnv(e.env, mode)
      modeEnv.keyBindings.set(keyBinding.key, keyBinding)
    },
    description: `Map '${keyBinding.key}' in mode '${mode}' to: ${keyBinding.action.description}`,
  }
}

export function createSetVarAction(varName: string, value: string): EzAction {
  return {
    perform: (e) => {
      e.env.vars.set(varName, value)
    },
    description: `Set variable '${varName}' to '${value}'`,
  }
}

export function createKeyReferenceAction(key: string): EzAction {
  return {
    perform: (e) => {
      const mode = getMode()
      return getActionForKey(key, mode, e.env)?.perform({ env: e.env, key })
    },
    description: key,
  }
}

export function createOfModeAction(mode: string): EzAction {
  return {
    perform: (e) => {
      if (e.key === null) return

      return getActionForKey(e.key, mode, e.env)?.perform({ env: e.env, key: e.key })
    },
    description: `Action in mode: ${mode}`,
  }
}

export function createCompositeEzAction(actions: EzAction[]): EzAction {
  return {
    perform: (e) => {
      for (const action of actions) {
        action.perform(e)
        // TODO handle async
      }
    },
    description: actions.map((a) => a.description).join(", "),
  }
}

// export function createKeyEzAction(action: {
//   perform: (keyChar: string, e: EzEvent) => unknown
//   description: string
// }): EzAction {
//   return {
//     perform: (e) => {
//       if (e.keyChar !== null) {
//         return action.perform(e.keyChar, e)
//       }
//     },
//     description: action.description,
//   }
// }

export function createJumpToBracketAction(
  findClosingDelim: boolean,
  closingBracket: string,
  openingBracket: string,
): EzAction {
  return {
    perform: (e) => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      const doc = editor.document
      const text = doc.getText()

      editor.selections = editor.selections.map((sel) => {
        let depth = 0
        for (let i = doc.offsetAt(sel.active); i < text.length; i++) {
          const char = text[i]
          if (char === closingBracket) {
            if (depth === 0) {
              const pos = doc.positionAt(i)
              return new vscode.Selection(pos, pos)
            }
            depth--
          } else if (char === openingBracket) {
            depth++
          }
        }
        return sel
      })
    },
    description: "Jump to bracket", // TODO
  }
}
