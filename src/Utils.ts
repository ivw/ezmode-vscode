import * as vscode from "vscode"

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
