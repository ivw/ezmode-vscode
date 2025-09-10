import { EventEmitter } from "vscode"
import { ENTER_MODE_KEY, EXIT_MODE_KEY, getEnv, getModeEnv } from "./EzEnv"

let mode: string = "type"
const modeChangeEmitter = new EventEmitter<string>()
export const onModeChange = modeChangeEmitter.event

export function getMode(): string {
  return mode
}

export function setMode(newMode: string) {
  if (newMode == getMode()) return

  const env = getEnv()

  const oldModeEnv = getModeEnv(env, getMode())
  const exitAction = oldModeEnv?.keyBindings.get(EXIT_MODE_KEY)
  if (exitAction) {
    exitAction.action.perform({ env, key: null })
  }

  mode = newMode

  const newModeEnv = getModeEnv(env, getMode())
  const enterAction = newModeEnv?.keyBindings.get(ENTER_MODE_KEY)
  if (enterAction) {
    enterAction.action.perform({ env, key: null })
  }

  modeChangeEmitter.fire(newMode)
}
