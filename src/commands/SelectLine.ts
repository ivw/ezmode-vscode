import * as vscode from "vscode"
import { changeSelectionRange } from "../Utils"

function startOfLine(line: vscode.TextLine): vscode.Position {
  return line.range.start.translate(0, line.firstNonWhitespaceCharacterIndex)
}

export function activateSelectLine(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand("ezmode.selectLine", (editor) => {
    const { document, selections } = editor

    editor.selections = selections.map((sel) => {
      if (sel.isSingleLine) {
        const line = document.lineAt(sel.start.line)
        return changeSelectionRange(sel, startOfLine(line), line.range.end)
      }

      const startLine = document.lineAt(sel.start.line)
      const endLine = document.lineAt(sel.end.line)
      return changeSelectionRange(sel, startOfLine(startLine), endLine.range.end)
    })
  })
  context.subscriptions.push(disposable)
}
