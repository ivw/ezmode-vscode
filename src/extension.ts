import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ui/ModeStatusBarItem"
import { activateSidebar } from "./ui/Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"
import { activateCommands } from "./commands"
import { activateCursorColor } from "./ui/CursorColor"
import { activateSelectModeListeners } from "./mode/SelectMode"
import { activateEnvModeSwitchHooks } from "./mode/EnvModeSwitchHooks"
import { loadConfig } from "./config/EnvState"

export function activate(context: vscode.ExtensionContext) {
  loadConfig(context)
  activateCommands(context)
  activateTypeActionHandler(context)
  activateCursorColor(context)
  activateSelectModeListeners(context)
  activateEnvModeSwitchHooks(context)
  activateModeStatusBarItem(context)
  activateSidebar(context)
}

export function deactivate() {}
