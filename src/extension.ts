import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ui/ModeStatusBarItem"
import { activateSidebar } from "./ui/Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"
import { activateCommands } from "./commands"
import { activateCursorColor } from "./ui/CursorColor"
import { activateSelectModeListeners } from "./mode/SelectMode"
import { activateEnvModeSwitchHooks } from "./mode/EnvModeSwitchHooks"

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
