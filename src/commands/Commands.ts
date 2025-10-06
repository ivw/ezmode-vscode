import * as vscode from "vscode"
import { switchMode } from "../ModeState"
import { activateSelectLine } from "./SelectLine"
import { activateSelectWord } from "./SelectWord"
import { activateSelectToDelim } from "./SelectToDelim"
import { activateRemoveDelim } from "./RemoveDelim"

export function activateCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("ezmode.enterEzMode", () => {
      switchMode("ez")
    }),
  )

  activateSelectLine(context)
  activateSelectWord(context)
  activateSelectToDelim(context)
  activateRemoveDelim(context)
}
