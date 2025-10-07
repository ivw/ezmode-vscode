import * as vscode from "vscode"
import { parseEzModeRc } from "./Parser"
import type { EzAction } from "./EzAction"
import baseRcString from "./BaseEzModeRc"

export let baseActions: EzAction[] = []
try {
  baseActions = parseEzModeRc(baseRcString)
} catch (e) {
  vscode.window.showErrorMessage(`Error parsing built-in ezmode keybindings: ${e}`)
}
