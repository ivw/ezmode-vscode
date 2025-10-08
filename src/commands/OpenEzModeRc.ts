import * as vscode from "vscode"
import { createRcFileIfNotExists, userVsCodeRcUri } from "../EzModeRcFiles"

export function activateOpenEzModeRc(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ezmode.editEzModeRc", async () => {
    await createRcFileIfNotExists(userVsCodeRcUri)
    const document = await vscode.workspace.openTextDocument(userVsCodeRcUri)
    await vscode.window.showTextDocument(document)
  })
  context.subscriptions.push(disposable)
}
