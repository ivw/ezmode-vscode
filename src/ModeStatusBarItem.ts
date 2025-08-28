import * as vscode from "vscode"

export function activateModeStatusBarItem(context: vscode.ExtensionContext) {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900)
  item.text = "ez"
  item.show()
  context.subscriptions.push(item)
}
