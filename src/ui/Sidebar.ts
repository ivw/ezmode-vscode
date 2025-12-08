import * as vscode from "vscode"
import { type KeyBinding, getModeEnv } from "../config/EzEnv"
import { getMode, afterModeChange } from "../mode/ModeState"
import { getEnv, onEnvChange } from "../config/EnvState"

export function activateSidebar(context: vscode.ExtensionContext) {
  const changeEmitter = new vscode.EventEmitter<KeyBinding | undefined | void>()
  const provider: vscode.TreeDataProvider<KeyBinding> = {
    onDidChangeTreeData: changeEmitter.event,
    getTreeItem: (element: KeyBinding) => {
      const key = element.key === " " ? "space" : element.key
      return new vscode.TreeItem(`${key}: ${element.description}`)
    },
    getChildren: (element?: KeyBinding) => {
      if (element) {
        // No nested children
        return []
      }
      const env = getEnv()
      const mode = getMode()
      const modeEnv = getModeEnv(env, mode)
      if (!modeEnv) {
        return []
      }
      return Array.from(modeEnv.keyBindings.values())
    },
  }
  context.subscriptions.push(vscode.window.registerTreeDataProvider("ezmode.cheatsheet", provider))

  context.subscriptions.push(onEnvChange(() => changeEmitter.fire()))
  context.subscriptions.push(afterModeChange(() => changeEmitter.fire()))
}
