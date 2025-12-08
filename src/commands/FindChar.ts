import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { moveSelection, revealCursor } from "../utils/Selection"

export function activateFindChar(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.findChar", async (editor, _, args) => {
    const text = editor.document.getText()
    const targetChar = args?.target
    if (typeof targetChar !== "string" || targetChar.length !== 1) {
      return
    }
    editor.selections = editor.selections.map((sel) => {
      if (args?.prev) {
        for (let i = editor.document.offsetAt(sel.active) - 2; i >= 0; i--) {
          if (text[i] === targetChar) {
            return moveSelection(sel, editor.document.positionAt(i), args?.select)
          }
        }
      } else {
        for (let i = editor.document.offsetAt(sel.active) + 1; i < text.length; i++) {
          if (text[i] === targetChar) {
            return moveSelection(sel, editor.document.positionAt(i), args?.select)
          }
        }
      }
      return sel
    })
    revealCursor(editor)
  })
}
