import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { unselect } from "../utils/Selection"

/**
 * `ezmode.unselect` is different from `cancelSelection` because it keeps all cursors.
 */
export function activateUnselect(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.unselect", (editor) => {
    editor.selections = editor.selections.map(unselect)
  })
}
