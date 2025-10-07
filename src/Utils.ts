import * as vscode from "vscode"
import { getMode } from "./ModeState"

export function changeSelectionRange(
  sel: vscode.Selection,
  newStart: vscode.Position,
  newEnd: vscode.Position,
): vscode.Selection {
  if (!sel.isEmpty && sel.isReversed) {
    return new vscode.Selection(newEnd, newStart)
  } else {
    return new vscode.Selection(newStart, newEnd)
  }
}

export function moveSelectionBasedOnMode(
  sel: vscode.Selection,
  pos: vscode.Position,
): vscode.Selection {
  const mode = getMode()
  if (mode === "select") {
    return new vscode.Selection(sel.anchor, pos)
  }
  return new vscode.Selection(pos, pos)
}
