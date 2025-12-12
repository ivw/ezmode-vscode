import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"
import { readFileToString } from "../utils/Files"

export function activateOpenEzModeTutorial(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.openEzModeTutorial", async () => {
    const content = await loadTutorialText(context)
    const document = await vscode.workspace.openTextDocument({ language: "markdown", content })
    return vscode.window.showTextDocument(document)
  })
}

async function loadTutorialText(context: vscode.ExtensionContext): Promise<string> {
  return readFileToString(vscode.Uri.joinPath(context.extensionUri, "data", "EzModeTutorial.md"))
}
