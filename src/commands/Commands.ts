import * as vscode from "vscode"
import { switchMode } from "../mode/ModeState"
import { activateSelectLine } from "./SelectLine"
import { activateSelectWord } from "./SelectWord"
import { activateSelectToDelim } from "./SelectToDelim"
import { activateRemoveDelim } from "./RemoveDelim"
import { activateToggleCase } from "./ToggleCase"
import { activateFlipSelection } from "./FlipSelection"
import { activateUnselect } from "./Unselect"
import { activateOpenEzModeRc } from "./OpenEzModeRc"

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
  activateToggleCase(context)
  activateFlipSelection(context)
  activateUnselect(context)
  activateOpenEzModeRc(context)
}
