import * as vscode from "vscode"
import { getActionForKey } from "./config/EzEnv"
import { getMode } from "./mode/ModeState"
import { getEnv } from "./config/EnvState"
import { registerCommand } from "./utils/Commands"

export function activateTypeActionHandler(context: vscode.ExtensionContext) {
  registerCommand(context, "type", (args) => {
    const key = args.text as string

    const env = getEnv()
    const mode = getMode()
    getActionForKey(key, mode, env)?.perform({ env, key })
  })
}
