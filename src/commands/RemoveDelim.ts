import * as vscode from "vscode"
import { getMatchingDelimEitherSide } from "../utils/delim/Delim"
import { registerTextEditorCommand } from "../utils/Commands"
import { revealCursor } from "../utils/Selection"

export function activateRemoveDelim(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.removeDelim", (editor, edit, args) => {
    editor.selections = editor.selections.map((sel) => {
      const matchingDelim = getMatchingDelimEitherSide(editor, sel)
      if (matchingDelim !== null) {
        const { aroundRange, insideRange } = matchingDelim
        edit.delete(new vscode.Range(aroundRange.start, insideRange.start))
        edit.delete(new vscode.Range(aroundRange.end, insideRange.end))

        return args?.selectContents ? matchingDelim.insideRange : sel
      }
      return sel
    })
    revealCursor(editor)
  })
}
