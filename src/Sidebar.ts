import * as vscode from "vscode"
import { keybindings, type KeyBinding } from "./EzEnv"

export function activateSidebar(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("ezmode.cheatsheet", new KeyBindingTreeDataProvider()),
  )
}

class KeyBindingTreeDataProvider implements vscode.TreeDataProvider<KeyBinding> {
  getTreeItem(element: KeyBinding): vscode.TreeItem {
    return new vscode.TreeItem(`${element.key}: ${element.action}`)
  }

  getChildren(element?: KeyBinding): KeyBinding[] {
    if (!element) {
      return keybindings
    }
    return []
  }
}
