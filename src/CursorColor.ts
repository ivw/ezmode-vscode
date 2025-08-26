import * as vscode from "vscode"

export function changeCursorColor(color: string) {
  const configuration = vscode.workspace.getConfiguration("workbench")

  // Set the color in the global user settings.
  configuration.update("colorCustomizations", { "editorCursor.foreground": color }, true)
}
