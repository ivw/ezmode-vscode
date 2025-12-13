import * as vscode from "vscode"
import { getModeConfig, onModeConfigsChange, type KeyBinding } from "../config/ModeConfig"
import { getMode, afterModeChange } from "../mode/ModeState"

export function activateSidebar(context: vscode.ExtensionContext) {
  const changeEmitter = new vscode.EventEmitter<KeyBinding | undefined | void>()
  const provider: vscode.TreeDataProvider<KeyBinding | string> = {
    onDidChangeTreeData: changeEmitter.event,
    getTreeItem: (element: KeyBinding | string) => {
      if (typeof element === "string") {
        return new vscode.TreeItem(element)
      }
      const key = element.key === " " ? "space" : element.key
      return new vscode.TreeItem(`${key}: ${element.description}`)
    },
    getChildren: (element?: KeyBinding | string) => {
      if (element) {
        // No nested children
        return []
      }
      const mode = getMode()

      const modeConfig = getModeConfig(mode)
      if (!modeConfig) {
        return []
      }

      if (mode === "type" && modeConfig.keyBindings.size === 1) {
        return ["No key bindings in type mode. Press Escape to switch to EzMode."]
      }
      return Array.from(modeConfig.keyBindings.values())
    },
  }
  context.subscriptions.push(vscode.window.registerTreeDataProvider("ezmode.cheatsheet", provider))

  context.subscriptions.push(onModeConfigsChange(() => changeEmitter.fire()))
  context.subscriptions.push(afterModeChange(() => changeEmitter.fire()))
}
