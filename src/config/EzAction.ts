import * as vscode from "vscode"
import { getOrAddModeEnv, getActionForKey, type KeyBinding } from "./EzEnv"
import { getMode, switchMode } from "../mode/ModeState"
import type { Delim } from "../utils/delim/Delim"
import { moveSelectionBasedOnMode, revealCursor, unselect } from "../utils/Selection"
import type { QuoteDelim } from "../utils/delim/QuoteDelim"
import { resolveVarString, varContext, type VarString } from "./Variables"
import { getEnv } from "./EnvState"

export type EzAction = (key: string | null) => Thenable<unknown> | void

export function createSwitchModeAction(mode: string): EzAction {
  return () => {
    switchMode(mode)
  }
}

export function createVsCodeEzAction(commandId: string, argsVarString: VarString | null): EzAction {
  const cachedArgsJson = typeof argsVarString === "string" ? parseJson(argsVarString) : null

  function parseJson(argsString: string): string | null {
    if (argsString === "") return null
    try {
      return JSON.parse(argsString)
    } catch {
      return argsString
    }
  }

  async function parseArgs(key: string | null): Promise<unknown | null> {
    if (argsVarString === null) return null
    if (typeof argsVarString === "string") return cachedArgsJson
    const argsString = await resolveVarString(argsVarString, varContext(key))
    return parseJson(argsString)
  }

  return async (key) => {
    const args = await parseArgs(key)

    // Note: Calling executeCommand with nullish args can cause problems,
    //   for example with `workbench.action.findInFiles`.
    return args == null
      ? vscode.commands.executeCommand(commandId)
      : vscode.commands.executeCommand(commandId, args)
  }
}

export const nativeEzAction: EzAction = (key) => {
  return vscode.commands.executeCommand("default:type", { text: key })
}

export function createWriteAction(message: VarString): EzAction {
  return async (key) => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const textWithoutSelIndex = await resolveVarString(message, varContext(key))

    return editor
      .edit((edit) => {
        editor.selections = editor.selections.map((sel, selectionIndex) => {
          // `message` may contain a variable that requires `selectionIndex`.
          // In that case, we resolve the var string again with `selectionIndex` info.
          let text = textWithoutSelIndex
          if (text === "") {
            const result = resolveVarString(message, varContext(key, sel, selectionIndex))
            // Ignore async results for selectionIndex based vars.
            if (typeof result === "string") {
              text = result
            }
          }

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
  }
}

export function createPopupAction(message: VarString): EzAction {
  return async (key) => {
    vscode.window.showInformationMessage(await resolveVarString(message, varContext(key)))
  }
}

export function createMapKeyBindingAction(mode: string, keyBinding: KeyBinding): EzAction {
  return () => {
    const modeEnv = getOrAddModeEnv(getEnv(), mode)
    modeEnv.keyBindings.set(keyBinding.key, keyBinding)
  }
}

export function createSetVarAction(varName: string, value: VarString): EzAction {
  return async (key) => {
    getEnv().vars.set(varName, await resolveVarString(value, varContext(key)))
  }
}

export function createKeyReferenceAction(key: string): EzAction {
  return () => {
    const mode = getMode()
    return getActionForKey(key, mode, getEnv())?.(key)
  }
}

export function createOfModeAction(mode: string): EzAction {
  return (key) => {
    if (key === null) return

    return getActionForKey(key, mode)?.(key)
  }
}

export function createCompositeEzAction(actions: EzAction[]): EzAction {
  return async (e) => {
    for (const action of actions) {
      await action(e)
    }
  }
}

export function createJumpToBracketAction(
  findClosingDelim: boolean,
  delims: Array<Delim>,
): EzAction {
  return () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    editor.selections = editor.selections.map((sel) => {
      for (const delim of delims) {
        const delimOffset = delim.findDelim(
          findClosingDelim,
          editor,
          editor.document.offsetAt(sel.active),
          true,
        )
        if (delimOffset !== null) {
          return moveSelectionBasedOnMode(sel, editor.document.positionAt(delimOffset))
        }
      }
      return sel
    })
    revealCursor(editor)
  }
}

export function createJumpToQuoteAction(delims: Array<QuoteDelim>): EzAction {
  return () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    editor.selections = editor.selections.map((sel) => {
      for (const delim of delims) {
        const delimOffset = delim.findAuto(editor, editor.document.offsetAt(sel.active))
        if (delimOffset !== null) {
          return moveSelectionBasedOnMode(sel, editor.document.positionAt(delimOffset))
        }
      }
      return sel
    })
    revealCursor(editor)
  }
}
