import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ModeStatusBarItem"
import { activateSidebar } from "./Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"
import { activateCommands } from "./commands/Commands"
import { activateCursorColor } from "./CursorColor"
import { activateSelectModeListeners } from "./SelectMode"
import { activateEnvModeSwitchHooks } from "./EnvModeSwitchHooks"

export function activate(context: vscode.ExtensionContext) {
  activateCommands(context)
  activateTypeActionHandler(context)
  activateCursorColor(context)
  activateSelectModeListeners(context)
  activateEnvModeSwitchHooks(context)
  activateModeStatusBarItem(context)
  activateSidebar(context)
}

export function deactivate() {}
