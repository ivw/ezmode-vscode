import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { emptyRange } from "../utils/Selection"

export function activateScroll(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.scroll", (editor, _, args) => {
    const visibleRange = editor.visibleRanges[0]
    if (!visibleRange) return

    const linesToMove = calculateLinesToMove(visibleRange, args?.amount ?? "halfPage")
    if (linesToMove === null) return

    const up = args?.direction === "up"
    const revealCenter = args?.revealCenter ?? true

    editor.selections = editor.selections.map((sel) => {
      const newLine = up
        ? Math.max(sel.active.line - linesToMove, 0)
        : Math.min(sel.active.line + linesToMove, editor.document.lineCount - 1)
      const newPos = sel.active.with(newLine)
      return new vscode.Selection(newPos, newPos)
    })
    editor.revealRange(
      emptyRange(editor.selection.active),
      revealCenter ? vscode.TextEditorRevealType.InCenter : vscode.TextEditorRevealType.Default,
    )
  })
}

function calculateLinesToMove(visibleRange: vscode.Range, amount: unknown): number | null {
  switch (amount) {
    case "halfPage":
      // Calculate a half page using `ceil`, because `floor` gives inconsistent results.
      return Math.ceil((visibleRange.end.line - visibleRange.start.line) / 2)
    case "page":
      return visibleRange.end.line - visibleRange.start.line
    default:
      const n = Number(amount)
      if (!Number.isNaN(n)) {
        return Math.floor(n)
      } else {
        return null
      }
  }
}
