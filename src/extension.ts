import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ui/ModeStatusBarItem"
import { activateSidebar } from "./ui/Sidebar"
import { activateCommands } from "./commands"
import { activateCursorColor } from "./ui/CursorColor"
import { activateSelectModeListeners } from "./mode/SelectMode"
import { activateConfigModeSwitchHooks } from "./mode/ConfigModeSwitchHooks"
import { loadConfig } from "./config/LoadConfig"
import { activateModalTypeHandler } from "./config/ModeConfig"

export function activate(context: vscode.ExtensionContext) {
  loadConfig(context)
  activateCommands(context)
  activateModalTypeHandler(context)
  activateCursorColor(context)
  activateSelectModeListeners(context)
  activateConfigModeSwitchHooks(context)
  activateModeStatusBarItem(context)
  activateSidebar(context)
}

export function deactivate() {}
