import * as vscode from "vscode"
import { getOrAddModeEnv, getActionForKey, type KeyBinding } from "./EzEnv"
import { getMode, switchMode } from "../mode/ModeState"
import type { Delim } from "../utils/delim/Delim"
import { moveSelectionBasedOnMode, revealCursor, unselect } from "../utils/Selection"
import type { QuoteDelim } from "../utils/delim/QuoteDelim"
import { resolveVars, varContext } from "./Variables"
import { getEnv } from "./EnvState"

export type EzAction = {
  perform: (key: string | null) => Thenable<unknown> | void
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
      // Note: Calling executeCommand with nullish args can cause problems,
      //   for example with `workbench.action.findInFiles`.
      return args == null
        ? vscode.commands.executeCommand(commandId)
        : vscode.commands.executeCommand(commandId, args)
    },
    description: `Command: ${commandId}${args != null ? `, args: ${JSON.stringify(args ?? undefined)}` : ""}`,
  }
}

export const nativeEzAction: EzAction = {
  perform: (key) => {
    return vscode.commands.executeCommand("default:type", { text: key })
  },
  description: "Native",
}

export function createWriteAction(message: string): EzAction {
  return {
    perform: (key) => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      return editor
        .edit((edit) => {
          editor.selections = editor.selections.map((sel, selectionIndex) => {
            const text = resolveVars(message, varContext(key, sel, selectionIndex))
            if (sel.isEmpty) {
              edit.insert(sel.active, text)
              return sel
            } else {
              edit.replace(sel, text)
              return unselect(sel)
            }
          })
        })
        .then(() => {
          revealCursor(editor)
        })
    },
    description: `Write: ${message}`,
  }
}

export function createPopupAction(message: string): EzAction {
  return {
    perform: (key) => {
      vscode.window.showInformationMessage(resolveVars(message, varContext(key)))
    },
    description: `Display notification: ${message}`,
  }
}

export function createMapKeyBindingAction(mode: string, keyBinding: KeyBinding): EzAction {
  return {
    perform: () => {
      const modeEnv = getOrAddModeEnv(getEnv(), mode)
      modeEnv.keyBindings.set(keyBinding.key, keyBinding)
    },
    description: `Map '${keyBinding.key}' in mode '${mode}' to: ${keyBinding.action.description}`,
  }
}

export function createSetVarAction(varName: string, value: string): EzAction {
  return {
    perform: (key) => {
      getEnv().vars.set(varName, resolveVars(value, varContext(key)))
    },
    description: `Set variable '${varName}' to '${value}'`,
  }
}

export function createKeyReferenceAction(key: string): EzAction {
  return {
    perform: () => {
      const mode = getMode()
      return getActionForKey(key, mode, getEnv())?.perform(key)
    },
    description: key,
  }
}

export function createOfModeAction(mode: string): EzAction {
  return {
    perform: (key) => {
      if (key === null) return

      return getActionForKey(key, mode)?.perform(key)
    },
    description: `Action in mode: ${mode}`,
  }
}

export function createCompositeEzAction(actions: EzAction[]): EzAction {
  return {
    perform: async (e) => {
      for (const action of actions) {
        await action.perform(e)
      }
    },
    description: actions.map((a) => a.description).join(", "),
  }
}

// export function createKeyEzAction(action: {
//   perform: (keyChar: string, key: string | null) => unknown
//   description: string
// }): EzAction {
//   return {
//     perform: (e) => {
//       if (key !== null) {
//         return action.perform(key)
//       }
//     },
//     description: action.description,
//   }
// }

export function createJumpToBracketAction(findClosingDelim: boolean, delim: Delim): EzAction {
  return {
    perform: () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      editor.selections = editor.selections.map((sel) => {
        const delimOffset = delim.findDelim(
          findClosingDelim,
          editor,
          editor.document.offsetAt(sel.active),
          true,
        )
        if (delimOffset !== null) {
          return moveSelectionBasedOnMode(sel, editor.document.positionAt(delimOffset))
        }
        return sel
      })
      revealCursor(editor)
    },
    description: `Move caret to ${delim.toNiceString(findClosingDelim)}`,
  }
}

export function createJumpToQuoteAction(delim: QuoteDelim): EzAction {
  return {
    perform: () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      editor.selections = editor.selections.map((sel) => {
        const delimOffset = delim.findAuto(editor, editor.document.offsetAt(sel.active))
        if (delimOffset !== null) {
          return moveSelectionBasedOnMode(sel, editor.document.positionAt(delimOffset))
        }
        return sel
      })
      revealCursor(editor)
    },
    description: `Move caret to ${delim.char}`,
  }
}
