import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { unselect, revealCursor } from "../utils/Selection"

export function activateSelectBasics(context: vscode.ExtensionContext) {
  /**
   * `ezmode.unselect` is different from `cancelSelection` because it keeps all cursors.
   */
  registerTextEditorCommand(context, "ezmode.unselect", (editor) => {
    editor.selections = editor.selections.map(unselect)
  })

  registerTextEditorCommand(context, "ezmode.flipSelection", (editor) => {
    editor.selections = editor.selections.map((sel) => new vscode.Selection(sel.active, sel.anchor))
    revealCursor(editor)
  })

  registerTextEditorCommand(context, "ezmode.jumpToAnchor", (editor) => {
    editor.selections = editor.selections.map((sel) => new vscode.Selection(sel.anchor, sel.anchor))
    revealCursor(editor)
  })

  registerTextEditorCommand(context, "ezmode.deleteSelectedText", (editor, edit) => {
    editor.selections.forEach((sel) => {
      if (!sel.isEmpty) {
        edit.delete(sel)
      }
    })
    revealCursor(editor)
  })
}
