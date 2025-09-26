import * as vscode from "vscode"
import { getMode, switchMode } from "./ModeState"

let selectModeAnchor: vscode.Position | null = null

function onEditorSelectionCouldHaveChanged(selections: readonly vscode.Selection[] | null = null) {
  const sels = selections ?? vscode.window.activeTextEditor?.selections
  if (!sels) return

  const hasSelection = !sels.every((sel) => sel.isEmpty)
  if (hasSelection) {
    selectModeAnchor = sels[0].anchor
    if (getMode() === "ez") {
      switchMode("select")
    }
  } else if (
    selectModeAnchor === null ||
    !vscode.window.activeTextEditor?.selection?.anchor?.isEqual(selectModeAnchor)
  ) {
    selectModeAnchor = null
    if (getMode() === "select") {
      switchMode("ez")
    }
  }
}

export function activateSelectModeListeners(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((e) => {
      onEditorSelectionCouldHaveChanged(e.selections)
    }),
  )

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      selectModeAnchor = null
      onEditorSelectionCouldHaveChanged()
    }),
  )
}
