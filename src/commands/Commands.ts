import * as vscode from "vscode"
import { setMode } from "../ModeState"
import { activateSelectLine } from "./SelectLine"
import { activateSelectWord } from "./SelectWord"

export function activateCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("ezmode.enterEzMode", () => {
      setMode("ez")
    }),
  )

  activateSelectLine(context)
  activateSelectWord(context)
}
