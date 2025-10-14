import * as vscode from "vscode"
import { changeSelectionRange } from "../utils/Selection"
import { registerTextEditorCommand } from "../utils/Commands"

function startOfLine(line: vscode.TextLine): vscode.Position {
  return line.range.start.translate(0, line.firstNonWhitespaceCharacterIndex)
}

export function activateSelectLine(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.selectLine", (editor) => {
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
}
