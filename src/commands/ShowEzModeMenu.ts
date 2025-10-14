import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"

const menuCommands: Array<string> = ["ezmode.editEzModeRc", "ezmode.reloadEzModeRc"]

type CommandObj = { command: string; title: string }

type CommandQuickPickItem = vscode.QuickPickItem & { commandId: string }

export function activateOpenEzModeMenu(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.openEzModeMenu", async () => {
    const commandObjs: Array<CommandObj> | undefined =
      vscode.extensions.getExtension("ivw.ezmode")?.packageJSON?.contributes?.commands
    const menuItems: Array<CommandQuickPickItem> = menuCommands.map((menuCommand) => {
      const commandObj = commandObjs?.find((commandObj) => commandObj.command === menuCommand)
      return {
        commandId: menuCommand,
        label: commandObj?.title ?? menuCommand,
      }
    })

    const pickedItem = await vscode.window.showQuickPick(menuItems, {})
    if (pickedItem) {
      vscode.commands.executeCommand(pickedItem.commandId)
    }
  })
}
