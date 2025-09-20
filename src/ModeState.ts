import * as vscode from "vscode"
import { EventEmitter } from "vscode"
import { ENTER_MODE_KEY, EXIT_MODE_KEY, getEnv, getModeEnv } from "./EzEnv"
import { changeCursorColor, resetCursorColor } from "./CursorColor"

let mode: string = "ez" // TODO use "type" as default mode
const modeChangeEmitter = new EventEmitter<string>()
export const onModeChange = modeChangeEmitter.event

let selectModeAnchor: vscode.Position | null = null

export function getMode(): string {
  return mode
}

export function setMode(newMode: string) {
  if (newMode == getMode()) return

  const env = getEnv()

  const oldModeEnv = getModeEnv(env, getMode())
  const exitAction = oldModeEnv?.keyBindings.get(EXIT_MODE_KEY)
  if (exitAction) {
    exitAction.action.perform({ env, key: null })
  }

  mode = newMode

  if (mode === "select") {
    if (selectModeAnchor === null) {
      const editor = vscode.window.activeTextEditor
      if (editor) {
        selectModeAnchor = editor.selection.anchor
      }
    }
  } else {
    selectModeAnchor = null
  }

  onEditorSelectionCouldHaveChanged()

  const newModeEnv = getModeEnv(env, getMode())
  const enterAction = newModeEnv?.keyBindings.get(ENTER_MODE_KEY)
  if (enterAction) {
    enterAction.action.perform({ env, key: null })
  }

  updateCursorColor()
  modeChangeEmitter.fire(mode)
}

function updateCursorColor() {
  if (mode === "type") {
    resetCursorColor()
  } else if (mode === "ez" || mode === "select") {
    changeCursorColor("#FF6200")
  } else {
    changeCursorColor("#589DF6")
  }
}

function onEditorSelectionCouldHaveChanged(selections: readonly vscode.Selection[] | null = null) {
  const sels = selections ?? vscode.window.activeTextEditor?.selections
  if (sels) {
    const hasSelection = !sels.every((sel) => sel.isEmpty)
    if (hasSelection && getMode() === "ez") {
      setMode("select")
    } else if (
      !hasSelection &&
      getMode() === "select" &&
      (selectModeAnchor === null ||
        !vscode.window.activeTextEditor?.selection?.anchor?.isEqual(selectModeAnchor))
    ) {
      setMode("ez")
    }
  }
}

export function activateModeListeners(context: vscode.ExtensionContext) {
  updateCursorColor()

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((e) => {
      onEditorSelectionCouldHaveChanged(e.selections)
    }),
  )

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      console.log(`active editor: ${editor}`)
      selectModeAnchor = null
      onEditorSelectionCouldHaveChanged()
    }),
  )

  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((e) => {
      if (e.focused) {
        updateCursorColor()
      } else {
        resetCursorColor()
      }
      console.log(`Active: ${e.active}, focused: ${e.focused}`)
    }),
  )
}
