import * as vscode from "vscode"
import { afterModeChange, getMode } from "./ModeState"

export function activateCursorColor(context: vscode.ExtensionContext) {
  updateCursorColor(getMode())

  context.subscriptions.push(afterModeChange(updateCursorColor))

  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((e) => {
      if (e.focused) {
        updateCursorColor(getMode())
      }
      console.log(`Active: ${e.active}, focused: ${e.focused}`)
    }),
  )
}

function updateCursorColor(newMode: string) {
  if (newMode === "type") {
    resetCursorColor()
  } else if (newMode === "ez" || newMode === "select") {
    changeCursorColor("#FF6200")
  } else {
    changeCursorColor("#589DF6")
  }
}
export function changeCursorColor(color: string | undefined) {
  const configuration = vscode.workspace.getConfiguration("workbench")

  // Set the color in the global user settings.
  configuration.update("colorCustomizations", { "editorCursor.foreground": color }, true)
}

export function resetCursorColor() {
  changeCursorColor(undefined)
}
