import * as vscode from "vscode"
import { getCommandTitle, registerCommand } from "../utils/Commands"

type CommandQuickPickItem = vscode.QuickPickItem & { commandId: string }

function createCommandQuickPickItem(commandId: string): CommandQuickPickItem {
  return { commandId, label: getCommandTitle(commandId) }
}

const menuItems: Array<CommandQuickPickItem> = [
  createCommandQuickPickItem("ezmode.executeCommand"),
  createCommandQuickPickItem("ezmode.editEzModeRc"),
  createCommandQuickPickItem("ezmode.reloadEzModeRc"),
  createCommandQuickPickItem("ezmode.openEzModeTutorial"),
  { label: "Toggle EzMode cheat sheet", commandId: "ezmode.cheatsheet.focus" },
]

export function activateOpenEzModeMenu(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.openEzModeMenu", async () => {
    const pickedItem = await vscode.window.showQuickPick(menuItems, {})
    if (pickedItem) {
      vscode.commands.executeCommand(pickedItem.commandId)
    }
  })
}
