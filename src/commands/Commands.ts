import * as vscode from "vscode"
import { switchMode } from "../ModeState"
import { activateSelectLine } from "./SelectLine"
import { activateSelectWord } from "./SelectWord"

export function activateCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("ezmode.enterEzMode", () => {
      switchMode("ez")
    }),
  )

  activateSelectLine(context)
  activateSelectWord(context)
}
