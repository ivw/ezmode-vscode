import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ModeStatusBarItem"
import { activateSidebar } from "./Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"
import { activateCommands } from "./commands/Commands"
import { activateModeListeners } from "./ModeState"

export function activate(context: vscode.ExtensionContext) {
  activateModeStatusBarItem(context)
  activateSidebar(context)
  activateTypeActionHandler(context)
  activateCommands(context)
  activateModeListeners(context)
}

export function deactivate() {}
