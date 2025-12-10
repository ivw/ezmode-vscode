import * as vscode from "vscode"
import {
  getOrAddModeEnv,
  performActionForKey,
  type KeyBinding,
  type EzAction,
  addBindingToModeEnv,
} from "./EzEnv"
import { switchMode } from "../mode/ModeState"
import { revealCursor, unselect } from "../utils/Selection"
import { resolveVarString, varContext, type VarString } from "./Variables"
import { getEnv } from "./EnvState"

export const noopEzAction: EzAction = () => {}

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
    addBindingToModeEnv(modeEnv, keyBinding)
  }
}

export function createSetVarAction(varName: string, value: VarString): EzAction {
  return async (key) => {
    getEnv().vars.set(varName, await resolveVarString(value, varContext(key)))
  }
}

export function createKeyReferenceAction(key: string): EzAction {
  return () => {
    return performActionForKey(key)
  }
}

export function createOfModeAction(mode: string): EzAction {
  return (key) => {
    if (key === null) return

    return performActionForKey(key, mode)
  }
}

export function createCompositeEzAction(actions: EzAction[]): EzAction {
  return async (e) => {
    for (const action of actions) {
      await action(e)
    }
  }
}
