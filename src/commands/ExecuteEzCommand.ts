import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"
import { performSingleAction } from "../config/EnvState"
import { parseLine } from "../config/Parser"

export function activateExecuteEzCommand(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.executeCommand", async () => {
    const result = await vscode.window.showInputBox({
      title: "Execute EzMode Command",
      placeHolder: "mode ez",
    })
    if (result) {
      try {
        const action = parseLine(result)
        if (action) {
          performSingleAction(action)
        }
      } catch (e) {
        vscode.window.showErrorMessage(String(e))
      }
    }
  })
}
