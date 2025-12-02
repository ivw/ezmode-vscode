import * as vscode from "vscode"
import { getMode } from "../mode/ModeState"

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

export function moveSelection(
  sel: vscode.Selection,
  pos: vscode.Position,
  shouldSelect: boolean,
): vscode.Selection {
  if (shouldSelect) {
    return new vscode.Selection(sel.anchor, pos)
  }
  return new vscode.Selection(pos, pos)
}

export function moveSelectionBasedOnMode(
  sel: vscode.Selection,
  pos: vscode.Position,
): vscode.Selection {
  return moveSelection(sel, pos, getMode() === "select")
}

export function unselect(sel: vscode.Selection): vscode.Selection {
  return new vscode.Selection(sel.active, sel.active)
}

export function emptyRange(position: vscode.Position) {
  return new vscode.Range(position, position)
}

export function revealCursor(editor: vscode.TextEditor) {
  editor.revealRange(emptyRange(editor.selection.active))
}
