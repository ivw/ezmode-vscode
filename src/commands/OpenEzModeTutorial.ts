import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"

export function activateOpenEzModeTutorial(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.openEzModeTutorial", async () => {
    const uri = vscode.Uri.parse("untitled:EzModeTutorial.md")
    const document = await vscode.workspace.openTextDocument(uri)
    const editor = await vscode.window.showTextDocument(document)
    editor.edit((builder) => {
      builder.insert(new vscode.Position(0, 0), tutorialText)
    })
  })
}

const tutorialText: string = `Hello` // TODO
