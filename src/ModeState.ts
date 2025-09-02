import { EventEmitter } from "vscode"
import { getEnv, getModeEnv } from "./EzEnv"

let mode: string = "type"
const modeChangeEmitter = new EventEmitter<string>()
export const onModeChange = modeChangeEmitter.event

export function getMode(): string {
  return mode
}

export function setMode(newMode: string) {
  const env = getEnv()

  const oldModeEnv = getModeEnv(env, getMode())
  const exitAction = oldModeEnv?.keyBindings.get("exitmode")
  if (exitAction) {
    exitAction.action.perform({ env, keyChar: null })
  }

  mode = newMode

  const newModeEnv = getModeEnv(env, getMode())
  const enterAction = newModeEnv?.keyBindings.get("entermode")
  if (enterAction) {
    enterAction.action.perform({ env, keyChar: null })
  }

  modeChangeEmitter.fire(newMode)
}
