import * as vscode from "vscode"
import { getMatchingDelimEitherSide } from "../utils/delim/Delim"
import { registerTextEditorCommand } from "../utils/Commands"
import { revealCursor } from "../utils/Selection"

export function activateSelectToDelim(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.selectToDelim", (editor, _edit, args) => {
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
    revealCursor(editor)
  })
}
