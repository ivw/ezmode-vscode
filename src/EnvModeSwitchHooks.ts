import * as vscode from "vscode"
import { afterModeChange, beforeModeChange, getMode } from "./ModeState"
import { getEnv, getModeEnv, EXIT_MODE_KEY, ENTER_MODE_KEY } from "./EzEnv"

export function activateEnvModeSwitchHooks(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    beforeModeChange(() => {
      const env = getEnv()
      const oldModeEnv = getModeEnv(env, getMode())
      const exitAction = oldModeEnv?.keyBindings.get(EXIT_MODE_KEY)
      if (exitAction) {
        exitAction.action.perform({ env, key: null })
      }
    }),
  )
  context.subscriptions.push(
    afterModeChange(() => {
      const env = getEnv()
      const newModeEnv = getModeEnv(env, getMode())
      const enterAction = newModeEnv?.keyBindings.get(ENTER_MODE_KEY)
      if (enterAction) {
        enterAction.action.perform({ env, key: null })
      }
    }),
  )
}
