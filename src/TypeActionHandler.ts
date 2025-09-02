import * as vscode from "vscode"
import { DEFAULT_KEY, getEnv, getModeEnv } from "./EzEnv"
import { getMode } from "./ModeState"

export function activateTypeActionHandler(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("type", (args) => {
    const keyChar = args.text as string

    const env = getEnv()
    const mode = getMode()
    const modeEnv = getModeEnv(env, mode)
    if (!modeEnv) {
      return vscode.commands.executeCommand("default:type", { text: keyChar })
    }
    const keyBindings = modeEnv.keyBindings
    const keyBinding = keyBindings.get(keyChar) ?? keyBindings.get(DEFAULT_KEY)
    if (keyBinding) {
      return keyBinding.action.perform({ env, keyChar })
    }
  })

  context.subscriptions.push(disposable)
}
