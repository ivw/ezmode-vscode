import * as vscode from "vscode"
import { getActionForKey, getEnv } from "./config/EzEnv"
import { getMode } from "./mode/ModeState"

export function activateTypeActionHandler(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("type", (args) => {
    const key = args.text as string

    const env = getEnv()
    const mode = getMode()
    getActionForKey(key, mode, env)?.perform({ env, key })
  })

  context.subscriptions.push(disposable)
}
