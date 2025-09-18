import * as vscode from "vscode"

// TODO handle in global state. Another window might have changed it already.
let originalCursorColor: string | undefined | null = null

export function changeCursorColor(color: string | undefined) {
  const configuration = vscode.workspace.getConfiguration("workbench")

  if (originalCursorColor === null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalCursorColor = configuration.get<any>("colorCustomizations")?.["editorCursor.foreground"]
  }

  // Set the color in the global user settings.
  configuration.update("colorCustomizations", { "editorCursor.foreground": color }, true)
}

export function resetCursorColor() {
  changeCursorColor(originalCursorColor === null ? undefined : originalCursorColor)
}
