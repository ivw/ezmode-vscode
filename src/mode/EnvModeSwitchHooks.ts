import * as vscode from "vscode"
import { afterModeChange, beforeModeChange, getMode } from "./ModeState"
import { getModeEnv } from "../config/EzEnv"
import { getEnv } from "../config/EnvState"

export const ENTER_MODE_KEY = "entermode"
export const EXIT_MODE_KEY = "exitmode"

export function activateEnvModeSwitchHooks(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    beforeModeChange(() => {
      const oldModeEnv = getModeEnv(getEnv(), getMode())
      const exitAction = oldModeEnv?.keyBindings.get(EXIT_MODE_KEY)
      if (exitAction) {
        exitAction.action(null)
      }
    }),
  )
  context.subscriptions.push(
    afterModeChange(() => {
      const newModeEnv = getModeEnv(getEnv(), getMode())
      const enterAction = newModeEnv?.keyBindings.get(ENTER_MODE_KEY)
      if (enterAction) {
        enterAction.action(null)
      }
    }),
  )
}
