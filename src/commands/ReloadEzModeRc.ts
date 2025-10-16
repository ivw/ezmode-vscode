import * as vscode from "vscode"
import { reloadConfig } from "../config/EnvState"
import { registerCommand } from "../utils/Commands"

export function activateReloadEzModeRc(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.reloadEzModeRc", () => reloadConfig(context))
}
