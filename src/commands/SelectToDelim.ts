import * as vscode from "vscode"
import { getAllDelims, type DelimRanges } from "../delim/Delim"

export function activateSelectToDelim(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand(
    "ezmode.selectToDelim",
    (editor, _edit, args) => {
      editor.selections = editor.selections.map((sel) => {
        const matchingDelim = getMatchingDelimEitherSide(editor, sel)
        if (matchingDelim !== null) {
          if (args?.around) {
            return matchingDelim.aroundRange
          }
          return matchingDelim.insideRange
        }
        return sel
      })
    },
  )
  context.subscriptions.push(disposable)
}

function getMatchingDelimEitherSide(
  editor: vscode.TextEditor,
  sel: vscode.Selection,
): DelimRanges | null {
  const delims = getAllDelims()
  for (const delim of delims) {
    const matchingDelim = delim.getMatchingDelim(false, editor, sel.start)
    if (matchingDelim !== null) return matchingDelim
  }
  for (const delim of delims) {
    const matchingDelim = delim.getMatchingDelim(true, editor, sel.end)
    if (matchingDelim !== null) return matchingDelim
  }
  return null
}
