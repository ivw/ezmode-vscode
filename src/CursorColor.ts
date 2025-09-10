import * as vscode from "vscode"

let originalCursorColor: string | undefined | null = null

export function changeCursorColor(color: string | undefined) {
  const configuration = vscode.workspace.getConfiguration("workbench")

  if (originalCursorColor === null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalCursorColor = configuration.get<any>("colorCustomizations")?.["editorCursor.foreground"]
  }

  // Set the color in the global user settings.
  // TODO problem: with multiple folders open, this will conflict.
  //   you'd have to globally manage it and listen for editor focus or something.
  configuration.update("colorCustomizations", { "editorCursor.foreground": color }, true)
}

export function resetCursorColor() {
  changeCursorColor(originalCursorColor === null ? undefined : originalCursorColor)
}
