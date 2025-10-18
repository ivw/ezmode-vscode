import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { revealCursor } from "../utils/Selection"

export function activateFlipSelection(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.flipSelection", (editor) => {
    editor.selections = editor.selections.map((sel) => new vscode.Selection(sel.active, sel.anchor))
    revealCursor(editor)
  })
}
