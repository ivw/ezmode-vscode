import * as vscode from "vscode"

let mode: string = "type"
const beforeModeChangeEmitter = new vscode.EventEmitter<string>()
const afterModeChangeEmitter = new vscode.EventEmitter<string>()
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
  updateContext()
}

function updateContext() {
  vscode.commands.executeCommand("setContext", "ezmode.mode", mode)
}
updateContext()
