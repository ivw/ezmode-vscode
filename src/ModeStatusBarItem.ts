import * as vscode from "vscode"
import { getMode, onModeChange } from "./ModeState"

export function activateModeStatusBarItem(context: vscode.ExtensionContext) {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900)
  item.text = getMode()
  item.show()
  context.subscriptions.push(item)

  onModeChange((mode: string) => {
    item.text = mode
  })
}
