import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ModeStatusBarItem"
import { activateSidebar } from "./Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"
import { activateCommands } from "./commands/Commands"

export function activate(context: vscode.ExtensionContext) {
  activateModeStatusBarItem(context)
  activateSidebar(context)
  activateTypeActionHandler(context)
  activateCommands(context)
}

export function deactivate() {}
