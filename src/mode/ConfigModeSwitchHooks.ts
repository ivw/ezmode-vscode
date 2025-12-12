import * as vscode from "vscode"
import { afterModeChange, beforeModeChange, getMode } from "./ModeState"
import { getModeConfig } from "../config/ModeConfig"

export const ENTER_MODE_KEY = "entermode"
export const EXIT_MODE_KEY = "exitmode"

export function activateConfigModeSwitchHooks(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    beforeModeChange(() => {
      const oldModeConfig = getModeConfig(getMode())
      const exitAction = oldModeConfig?.keyBindings.get(EXIT_MODE_KEY)
      if (exitAction) {
        exitAction.action(null)
      }
    }),
  )
  context.subscriptions.push(
    afterModeChange(() => {
      const newModeConfig = getModeConfig(getMode())
      const enterAction = newModeConfig?.keyBindings.get(ENTER_MODE_KEY)
      if (enterAction) {
        enterAction.action(null)
      }
    }),
  )
}
