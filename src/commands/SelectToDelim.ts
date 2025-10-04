import * as vscode from "vscode"
import { getAllDelims } from "../delim/Delim"
import { selectionFromRange } from "../Utils"

export function activateSelectToDelim(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand("ezmode.selectToDelim", (editor) => {
    editor.selections = editor.selections.map((sel) => {
      for (const delim of getAllDelims()) {
        const matchingDelim = delim.getMatchingDelim(false, editor, sel.start)
        if (matchingDelim !== null) {
          return selectionFromRange(matchingDelim.insideRange)
        }
      }
      for (const delim of getAllDelims()) {
        const matchingDelim = delim.getMatchingDelim(true, editor, sel.end)
        if (matchingDelim !== null) {
          return selectionFromRange(matchingDelim.insideRange)
        }
      }

      return sel
    })
  })
  context.subscriptions.push(disposable)
}
