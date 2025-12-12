import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ui/ModeStatusBarItem"
import { activateSidebar } from "./ui/Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"
import { activateCommands } from "./commands"
import { activateCursorColor } from "./ui/CursorColor"
import { activateSelectModeListeners } from "./mode/SelectMode"
import { activateConfigModeSwitchHooks } from "./mode/ConfigModeSwitchHooks"
import { loadConfig } from "./config/LoadConfig"

export function activate(context: vscode.ExtensionContext) {
  loadConfig(context)
  activateCommands(context)
  activateTypeActionHandler(context)
  activateCursorColor(context)
  activateSelectModeListeners(context)
  activateConfigModeSwitchHooks(context)
  activateModeStatusBarItem(context)
  activateSidebar(context)
}

export function deactivate() {}
