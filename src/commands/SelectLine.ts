import * as vscode from "vscode"
import { changeSelectionRange } from "../Utils"

export function activateSelectLine(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ezmode.selectLine", () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    const { document, selections } = editor

    editor.selections = selections.map((sel) => {
      if (sel.isSingleLine) {
        const line = document.lineAt(sel.start.line)
        return changeSelectionRange(sel, line.range.start, line.range.end)
      }

      return changeSelectionRange(
        sel,
        document.lineAt(sel.start.line).range.start,
        document.lineAt(sel.end.line).range.end,
      )
    })
  })
  context.subscriptions.push(disposable)
}
