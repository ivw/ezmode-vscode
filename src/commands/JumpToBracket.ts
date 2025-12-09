import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { moveSelectionBasedOnMode, revealCursor } from "../utils/Selection"
import { pairDelim } from "../utils/delim/PairDelim"

export function activateJumpToBracket(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.jumpToBracket", async (editor, _, args) => {
    const delimStrings = args?.delims
    if (!Array.isArray(delimStrings)) return

    const findClosingDelim = args?.goToOpen !== true

    editor.selections = editor.selections.map((sel) => {
      for (const delimString of delimStrings) {
        if (typeof delimString !== "string" || delimString.length !== 2) continue
        const delim = pairDelim(delimString[0], delimString[1])
        const delimOffset = delim.findDelim(
          findClosingDelim,
          editor,
          editor.document.offsetAt(sel.active),
          true,
        )
        if (delimOffset !== null) {
          return moveSelectionBasedOnMode(sel, editor.document.positionAt(delimOffset))
        }
      }
      return sel
    })
    revealCursor(editor)
  })
}
