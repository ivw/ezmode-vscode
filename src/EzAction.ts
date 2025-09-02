import * as vscode from "vscode"
import type { EzEnv } from "./EzEnv"
import { setMode } from "./ModeState"

export type EzEvent = {
  env: EzEnv
  keyChar: string | null
}

export type EzAction = {
  perform: (e: EzEvent) => unknown
  description: string
}

export function createSwitchModeAction(mode: string): EzAction {
  return {
    perform: () => {
      setMode(mode)
    },
    description: `Switch mode to ${mode}`,
  }
}

export function createVsCodeEzAction(commandId: string): EzAction {
  return {
    perform: () => {
      return vscode.commands.executeCommand(commandId)
    },
    description: `Command: ${commandId}`,
  }
}

export const nativeEzAction: EzAction = {
  perform: (e) => {
    return vscode.commands.executeCommand("default:type", { text: e.keyChar })
  },
  description: "Native",
}

export function createPopupAction(message: string): EzAction {
  return {
    perform: () => {
      vscode.window.showInformationMessage(message)
    },
    description: `Display notification: ${message}`,
  }
}
