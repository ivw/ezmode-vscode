import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"
import { performSingleAction } from "../config/EnvState"
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
          performSingleAction(action)
        }
      } catch (e) {
        vscode.window.showErrorMessage(String(e))
      }
    }
  })
}
