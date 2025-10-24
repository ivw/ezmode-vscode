import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"

/**
 * A single command that shows the next change regardless of the type of the editor.
 */
export function activateNextChange(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.nextChange", async (editor, _, args) => {
    const direction = args?.reversed ? "previousChange" : "nextChange"

    // VSCode does not expose whether the editor is a compareEditor,
    // so we try `compareEditor.nextChange` first and see if it did anything.
    const prevPos = editor.selection.active
    const prevVis = editor.visibleRanges
    await vscode.commands.executeCommand(`workbench.action.compareEditor.${direction}`)
    const newPos = editor.selection.active
    const newVis = editor.visibleRanges

    if (newPos.isEqual(prevPos) && newVis === prevVis) {
      return vscode.commands.executeCommand(`workbench.action.editor.${direction}`)
    }
  })
}
