import * as vscode from "vscode"

/**
 * `ezmode.unselect` is different from `cancelSelection` because it keeps all cursors.
 */
export function activateUnselect(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand(
    "ezmode.unselect",
    (editor) => {
      editor.selections = editor.selections.map((sel) => {
        return new vscode.Selection(sel.active, sel.active)
      })
    },
  )
  context.subscriptions.push(disposable)
}
