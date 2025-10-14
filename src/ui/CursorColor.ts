import * as vscode from "vscode"
import { afterModeChange, getMode } from "../mode/ModeState"
import { getEnv, onEnvChange } from "../config/EnvState"

export function activateCursorColor(context: vscode.ExtensionContext) {
  updateCursorColor()

  context.subscriptions.push(afterModeChange(updateCursorColor))

  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((e) => {
      if (e.focused) {
        updateCursorColor()
      }
      console.log(`Active: ${e.active}, focused: ${e.focused}`)
    }),
  )

  context.subscriptions.push(
    onEnvChange(() => {
      updateCursorColor()
    }),
  )
}

function getPrimaryCursorColor(): string {
  return getEnv().vars.get("primarycolor") ?? "#FF6200"
}

function getSecondaryCursorColor(): string {
  return getEnv().vars.get("secondarycolor") ?? "#589DF6"
}

function updateCursorColor(mode: string = getMode()) {
  if (mode === "type") {
    resetCursorColor()
  } else if (mode === "ez" || mode === "select") {
    changeCursorColor(getPrimaryCursorColor())
  } else {
    changeCursorColor(getSecondaryCursorColor())
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
