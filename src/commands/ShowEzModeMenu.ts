import * as vscode from "vscode"
import { getCommandTitle, registerCommand } from "../utils/Commands"

const menuCommands: Array<string> = [
  "ezmode.editEzModeRc",
  "ezmode.reloadEzModeRc",
  "ezmode.cheatsheet.focus",
]

type CommandQuickPickItem = vscode.QuickPickItem & { commandId: string }

export function activateOpenEzModeMenu(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.openEzModeMenu", async () => {
    const menuItems: Array<CommandQuickPickItem> = menuCommands.map((menuCommand) => ({
      commandId: menuCommand,
      label: getCommandTitle(menuCommand),
    }))

    const pickedItem = await vscode.window.showQuickPick(menuItems, {})
    if (pickedItem) {
      vscode.commands.executeCommand(pickedItem.commandId)
    }
  })
}
