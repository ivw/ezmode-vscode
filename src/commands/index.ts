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
import { activateReloadEzModeRc } from "./ReloadEzModeRc"
import { registerCommand } from "../utils/Commands"
import { activateOpenEzModeMenu } from "./ShowEzModeMenu"
import { activateExecuteEzCommand } from "./ExecuteEzCommand"
import { activateOpenEzModeTutorial } from "./OpenEzModeTutorial"
import { activateNextChangedFile } from "./NextChangedFile"
import { activateNextChange } from "./NextChange"
import { activateGitReview } from "./GitReview"

export function activateCommands(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.enterEzMode", () => {
    switchMode("ez")
  })

  activateSelectLine(context)
  activateSelectWord(context)
  activateSelectToDelim(context)
  activateRemoveDelim(context)
  activateToggleCase(context)
  activateFlipSelection(context)
  activateUnselect(context)
  activateOpenEzModeRc(context)
  activateReloadEzModeRc(context)
  activateOpenEzModeMenu(context)
  activateExecuteEzCommand(context)
  activateOpenEzModeTutorial(context)
  activateNextChangedFile(context)
  activateNextChange(context)
  activateGitReview(context)
}
