import * as vscode from "vscode"
import { findDelimRanges } from "../utils/delim/Delim"
import { registerTextEditorCommand } from "../utils/Commands"
import { revealCursor } from "../utils/Selection"

export function activateSelectToDelim(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.selectToDelim", (editor, _edit, args) => {
    editor.selections = editor.selections.map((sel) => {
      const shouldSelectAround = args?.around ?? false
      const matchingDelim = findDelimRanges(
        editor,
        sel,
        shouldSelectAround ? "selectAround" : "selectInside",
      )
      if (matchingDelim !== null) {
        return shouldSelectAround ? matchingDelim.aroundRange : matchingDelim.insideRange
      }
      return sel
    })
    revealCursor(editor)
  })
}
