import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"
import { readFileToString } from "../config/EzModeRcFiles"

export function activateOpenEzModeTutorial(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.openEzModeTutorial", async () => {
    const content = await loadTutorialText(context)
    const uri = vscode.Uri.parse("untitled:EzModeTutorial.md")
    const document = await vscode.workspace.openTextDocument(uri)
    const editor = await vscode.window.showTextDocument(document)
    editor.edit((edit) => {
      edit.insert(new vscode.Position(0, 0), content)
    })
  })
}

async function loadTutorialText(context: vscode.ExtensionContext): Promise<string> {
  return readFileToString(vscode.Uri.joinPath(context.extensionUri, "data", "EzModeTutorial.md"))
}
