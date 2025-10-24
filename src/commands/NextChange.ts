import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { isDiffEditor } from "../utils/Git"

/**
 * A single command that shows the next change regardless of the type of the editor.
 */
export function activateNextChange(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.nextChange", (editor, _, args) => {
    const direction = args?.reversed ? "previousChange" : "nextChange"

    if (isDiffEditor()) {
      return vscode.commands.executeCommand(`workbench.action.compareEditor.${direction}`)
    } else {
      return vscode.commands.executeCommand(`workbench.action.editor.${direction}`)
    }
  })
}
