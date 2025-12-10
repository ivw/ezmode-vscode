import * as vscode from "vscode"
import { performActionForKey } from "./config/EzEnv"
import { registerCommand } from "./utils/Commands"

export function activateTypeActionHandler(context: vscode.ExtensionContext) {
  registerCommand(context, "type", (args) => {
    const key = args.text as string

    performActionForKey(key)
  })
}
