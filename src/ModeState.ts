import { EventEmitter } from "vscode"

var mode: string = "ez"
const modeChangeEmitter = new EventEmitter<string>()
export const onModeChange = modeChangeEmitter.event

export function getMode(): string {
  return mode
}

export function setMode(newMode: string) {
  mode = newMode
  modeChangeEmitter.fire(newMode)
}
