import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"

/**
 * `ezmode.unselect` is different from `cancelSelection` because it keeps all cursors.
 */
export function activateUnselect(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.unselect", (editor) => {
    editor.selections = editor.selections.map((sel) => new vscode.Selection(sel.active, sel.active))
  })
}
