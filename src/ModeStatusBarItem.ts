import * as vscode from "vscode"
import { getMode, afterModeChange } from "./ModeState"

export function activateModeStatusBarItem(context: vscode.ExtensionContext) {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1100)
  item.text = getMode()
  item.show()
  context.subscriptions.push(item)

  context.subscriptions.push(
    afterModeChange((mode: string) => {
      item.text = mode
    }),
  )
}
