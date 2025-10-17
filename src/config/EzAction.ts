import * as vscode from "vscode"
import { getOrAddModeEnv, getActionForKey, type EzEnv, type KeyBinding } from "./EzEnv"
import { getMode, switchMode } from "../mode/ModeState"
import { changeCursorColor, resetCursorColor } from "../ui/CursorColor"
import type { Delim } from "../utils/delim/Delim"
import { moveSelectionBasedOnMode, unselect } from "../utils/Selection"
import type { QuoteDelim } from "../utils/delim/QuoteDelim"
import { resolveVars, varContext } from "./Variables"

export type EzEvent = {
  env: EzEnv // TODO still needed?
  key: string | null
}

export type EzAction = {
  perform: (e: EzEvent) => Thenable<unknown> | void
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
  perform: (e) => {
    return vscode.commands.executeCommand("default:type", { text: e.key })
  },
  description: "Native",
}

export function createWriteAction(message: string): EzAction {
  return {
    perform: (e) => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      return editor.edit((edit) => {
        editor.selections = editor.selections.map((sel, selectionIndex) => {
          const text = resolveVars(message, varContext(e.key, sel, selectionIndex))
          if (sel.isEmpty) {
            edit.insert(sel.active, text)
            return sel
          } else {
            edit.replace(sel, text)
            return unselect(sel)
          }
        })
      })
    },
    description: `Write: ${message}`,
  }
}

export function createPopupAction(message: string): EzAction {
  return {
    perform: (e) => {
      vscode.window.showInformationMessage(resolveVars(message, varContext(e.key)))
    },
    description: `Display notification: ${message}`,
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
      e.env.vars.set(varName, resolveVars(value, varContext(e.key)))
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
    perform: async (e) => {
      for (const action of actions) {
        await action.perform(e)
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
    },
    description: `Move caret to ${delim.char}`,
  }
}
