import * as vscode from "vscode"
import { setMode } from "../ModeState"

export function activateCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("ezmode.enterEzMode", () => {
      setMode("ez")
    }),
  )
}
