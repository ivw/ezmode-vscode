import * as vscode from "vscode"
import { switchMode } from "../mode/ModeState"
import { activateSelectLine } from "./SelectLine"
import { activateSelectWord } from "./SelectWord"
import { activateSelectToDelim } from "./SelectToDelim"
import { activateRemoveDelim } from "./RemoveDelim"
import { activateToggleCase } from "./ToggleCase"
import { activateSelectBasics } from "./SelectBasics"
import { activateEzModeRcCommands } from "./EzModeRc"
import { registerCommand } from "../utils/Commands"
import { activateOpenEzModeMenu } from "./ShowEzModeMenu"
import { activateExecuteEzCommand } from "./ExecuteEzCommand"
import { activateOpenEzModeTutorial } from "./OpenEzModeTutorial"
import { activateNextChangedFile } from "./NextChangedFile"
import { activateNextChange } from "./NextChange"
import { activateGitReview } from "./GitReview"
import { activateNumberOperation } from "./NumberOperation"
import { activateScroll } from "./Scroll"
import { activateFindChar } from "./FindChar"

export function activateCommands(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.enterEzMode", () => {
    switchMode("ez")
  })

  activateSelectLine(context)
  activateSelectWord(context)
  activateSelectToDelim(context)
  activateRemoveDelim(context)
  activateToggleCase(context)
  activateSelectBasics(context)
  activateEzModeRcCommands(context)
  activateOpenEzModeMenu(context)
  activateExecuteEzCommand(context)
  activateOpenEzModeTutorial(context)
  activateNextChangedFile(context)
  activateNextChange(context)
  activateGitReview(context)
  activateNumberOperation(context)
  activateScroll(context)
  activateFindChar(context)
}
