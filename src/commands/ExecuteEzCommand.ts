import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"
import { parseLine } from "../config/Parser"

export function activateExecuteEzCommand(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.executeCommand", async (args) => {
    const commandStr: string =
      args?.command ||
      (await vscode.window.showInputBox({
        title: "Execute EzMode Command",
        placeHolder: "mode ez",
      }))
    if (commandStr) {
      try {
        const action = parseLine(commandStr)
        if (action) {
          action(null)
        }
      } catch (e) {
        vscode.window.showErrorMessage(String(e))
      }
    }
  })
}
