import * as vscode from "vscode"
import { activateModeStatusBarItem } from "./ModeStatusBarItem"
import { activateSidebar } from "./Sidebar"
import { activateTypeActionHandler } from "./TypeActionHandler"

export function activate(context: vscode.ExtensionContext) {
  activateModeStatusBarItem(context)
  activateSidebar(context)
  activateTypeActionHandler(context)
}

export function deactivate() {}
