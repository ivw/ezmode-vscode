import * as vscode from "vscode"
import { getMatchingDelimEitherSide } from "../utils/delim/Delim"

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
