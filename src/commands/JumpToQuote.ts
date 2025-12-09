import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { moveSelectionBasedOnMode, revealCursor } from "../utils/Selection"
import { quoteDelim } from "../utils/delim/QuoteDelim"

export function activateJumpToQuote(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.jumpToQuote", async (editor, _, args) => {
    const quoteStrings = args?.quotes
    if (!Array.isArray(quoteStrings)) return

    editor.selections = editor.selections.map((sel) => {
      for (const quoteString of quoteStrings) {
        if (typeof quoteString !== "string" || quoteString.length !== 1) continue
        const delim = quoteDelim(quoteString)
        const delimOffset = delim.findAuto(editor, editor.document.offsetAt(sel.active))
        if (delimOffset !== null) {
          return moveSelectionBasedOnMode(sel, editor.document.positionAt(delimOffset))
        }
      }
      return sel
    })
    revealCursor(editor)
  })
}
