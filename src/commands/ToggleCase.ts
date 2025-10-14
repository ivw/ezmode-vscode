import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"

export function activateToggleCase(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.toggleCase", (editor, edit) => {
    const { document, selections } = editor

    editor.selections = selections.map((sel) => {
      const toggleRange: vscode.Range = sel.isEmpty
        ? new vscode.Range(sel.active, sel.active.translate(0, 1))
        : sel
      edit.replace(toggleRange, toggleCase(document.getText(toggleRange)))
      return sel
    })
  })
}

function toggleCase(text: string): string {
  let newText = ""
  for (const char of text) {
    let toggled = char.toLocaleLowerCase()
    if (toggled === char) {
      toggled = char.toLocaleUpperCase()
    }
    newText += toggled
  }
  return newText
}
