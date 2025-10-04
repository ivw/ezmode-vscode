import * as vscode from "vscode"
import { getAllDelims } from "../delim/Delim"

export function activateSelectToDelim(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand("ezmode.selectToDelim", (editor) => {
    editor.selections = editor.selections.map((sel) => {
      for (const delim of getAllDelims()) {
        const matchingDelim = delim.getMatchingDelim(false, editor, sel.start)
        if (matchingDelim !== null) {
          return new vscode.Selection(
            matchingDelim.insideRange.start,
            matchingDelim.insideRange.end,
          )
        }
      }
      for (const delim of getAllDelims()) {
        const matchingDelim = delim.getMatchingDelim(true, editor, sel.end)
        if (matchingDelim !== null) {
          return new vscode.Selection(
            matchingDelim.insideRange.start,
            matchingDelim.insideRange.end,
          )
        }
      }

      return sel
    })
  })
  context.subscriptions.push(disposable)
}
