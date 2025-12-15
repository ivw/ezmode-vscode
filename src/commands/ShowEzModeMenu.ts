import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"

type CommandQuickPickItem = vscode.QuickPickItem & { commandId: string }

export function activateOpenEzModeMenu(context: vscode.ExtensionContext) {
  const commands: Array<{ command?: string; title?: string }> | undefined =
    context.extension.packageJSON.contributes?.commands

  function createCommandQuickPickItem(commandId: string): CommandQuickPickItem {
    const commandObj = commands?.find(({ command }) => command === commandId)
    return { commandId, label: commandObj?.title ?? commandId }
  }

  const menuItems: Array<CommandQuickPickItem> = [
    createCommandQuickPickItem("ezmode.executeCommand"),
    createCommandQuickPickItem("ezmode.editEzModeRc"),
    createCommandQuickPickItem("ezmode.reloadEzModeRc"),
    createCommandQuickPickItem("ezmode.openEzModeTutorial"),
    { label: "Toggle EzMode Cheat Sheet", commandId: "ezmode.cheatsheet.focus" },
  ]

  registerCommand(context, "ezmode.openEzModeMenu", async () => {
    const pickedItem = await vscode.window.showQuickPick(menuItems, {})
    if (pickedItem) {
      vscode.commands.executeCommand(pickedItem.commandId)
    }
  })
}
