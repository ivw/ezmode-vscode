import * as vscode from "vscode"
import { reloadConfig } from "../config/EnvState"

export function activateReloadEzModeRc(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ezmode.reloadEzModeRc", reloadConfig)
  context.subscriptions.push(disposable)
}
