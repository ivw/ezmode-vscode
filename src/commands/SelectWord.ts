import * as vscode from "vscode"
import { changeSelectionRange } from "../Utils"

export function activateSelectWord(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ezmode.selectWord", () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    const { document, selections } = editor

    editor.selections = selections.map((sel) => {
      if (sel.isEmpty) {
        const wordRange = document.getWordRangeAtPosition(sel.active)
        return wordRange ? changeSelectionRange(sel, wordRange.start, wordRange.end) : sel
      }

      const startWordRange = document.getWordRangeAtPosition(sel.start)
      const startPosition = startWordRange ? startWordRange.start : sel.start

      const endWordRange = document.getWordRangeAtPosition(sel.end)
      const endPosition = endWordRange ? endWordRange.end : sel.end

      return changeSelectionRange(sel, startPosition, endPosition)
    })
  })
  context.subscriptions.push(disposable)
}
