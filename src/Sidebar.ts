import * as vscode from "vscode"
import { type KeyBinding, getEnv, getModeEnv, onEnvChange } from "./EzEnv"
import { getMode, afterModeChange } from "./ModeState"

export function activateSidebar(context: vscode.ExtensionContext) {
  const changeEmitter = new vscode.EventEmitter<KeyBinding | undefined | void>()
  const provider: vscode.TreeDataProvider<KeyBinding> = {
    onDidChangeTreeData: changeEmitter.event,
    getTreeItem: (element: KeyBinding) => {
      const key = element.key === " " ? "space" : element.key
      return new vscode.TreeItem(`${key}: ${element.action.description}`)
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
