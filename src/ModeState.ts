import * as vscode from "vscode"
import { EventEmitter } from "vscode"

let mode: string = "ez" // TODO use "type" as default mode
const beforeModeChangeEmitter = new EventEmitter<string>()
const afterModeChangeEmitter = new EventEmitter<string>()
export const beforeModeChange = beforeModeChangeEmitter.event
export const afterModeChange = afterModeChangeEmitter.event

export function getMode(): string {
  return mode
}

export function switchMode(newMode: string) {
  if (newMode == getMode()) return
  if (newMode === "ez" && vscode.window.activeTextEditor?.selection?.isEmpty === false) {
    newMode = "select"
  }
  beforeModeChangeEmitter.fire(newMode)
  mode = newMode
  afterModeChangeEmitter.fire(newMode)
  vscode.commands.executeCommand("setContext", "ezmode.mode", newMode)
}

vscode.commands.executeCommand("setContext", "ezmode.mode", mode)
