import * as vscode from "vscode"
import { afterModeChange, beforeModeChange, getMode } from "./ModeState"
import { getModeEnv, EXIT_MODE_KEY, ENTER_MODE_KEY } from "../config/EzEnv"
import { getEnv } from "../config/EnvState"

export function activateEnvModeSwitchHooks(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    beforeModeChange(() => {
      const oldModeEnv = getModeEnv(getEnv(), getMode())
      const exitAction = oldModeEnv?.keyBindings.get(EXIT_MODE_KEY)
      if (exitAction) {
        exitAction.action.perform(null)
      }
    }),
  )
  context.subscriptions.push(
    afterModeChange(() => {
      const newModeEnv = getModeEnv(getEnv(), getMode())
      const enterAction = newModeEnv?.keyBindings.get(ENTER_MODE_KEY)
      if (enterAction) {
        enterAction.action.perform(null)
      }
    }),
  )
}
