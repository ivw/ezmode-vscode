import * as vscode from "vscode"

export function activateToggleCase(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand(
    "ezmode.toggleCase",
    (editor, edit) => {
      const { document, selections } = editor

      editor.selections = selections.map((sel) => {
        const toggleRange: vscode.Range = sel.isEmpty
          ? new vscode.Range(sel.active, sel.active.translate(0, 1))
          : sel
        edit.replace(toggleRange, toggleCase(document.getText(toggleRange)))
        return sel
      })
    },
  )
  context.subscriptions.push(disposable)
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
