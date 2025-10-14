import * as vscode from "vscode"
import { createRcFileIfNotExists, userVsCodeRcUri } from "../config/EzModeRcFiles"
import { registerCommand } from "../utils/Commands"

export function activateOpenEzModeRc(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.editEzModeRc", async () => {
    await createRcFileIfNotExists(userVsCodeRcUri)
    const document = await vscode.workspace.openTextDocument(userVsCodeRcUri)
    await vscode.window.showTextDocument(document)
  })
}
