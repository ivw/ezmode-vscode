import * as vscode from "vscode"

export function activateFlipSelection(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand("ezmode.flipSelection", (editor) => {

    editor.selections = editor.selections.map((sel) => new vscode.Selection(sel.active, sel.anchor))
  })
  context.subscriptions.push(disposable)
}
