import * as vscode from "vscode"
import { createRcFileIfNotExists, userVsCodeRcUri } from "../config/EzModeRcFiles"
import { registerCommand } from "../utils/Commands"
import { reloadConfig } from "../config/EnvState"

export function activateEzModeRcCommands(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.editEzModeRc", async () => {
    await createRcFileIfNotExists(context, userVsCodeRcUri)
    const document = await vscode.workspace.openTextDocument(userVsCodeRcUri)
    await vscode.window.showTextDocument(document)
  })
  registerCommand(context, "ezmode.reloadEzModeRc", () => reloadConfig(context))
}
