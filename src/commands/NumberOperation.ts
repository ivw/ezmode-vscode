import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"

export function activateNumberOperation(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.numberOperation", (editor, edit, args) => {
    const { document, selections } = editor

    selections.forEach((sel) => {
      const numberRange = findNumberRange(sel, document)
      if (numberRange !== null) {
        const n = Number(document.getText(numberRange))
        if (!Number.isNaN(n)) {
          const newN = performNumberOp(n, args?.op ?? "+")
          edit.replace(numberRange, String(newN))
        }
      }
    })
  })
}

function performNumberOp(n: number, op: string): number | null {
  if (op === "+") return n + 1
  if (op === "-") return n - 1
  if (op === "*") return n * 2
  if (op === "/") return Math.floor(n / 2)
  return null
}

function findNumberRange(
  sel: vscode.Selection,
  document: vscode.TextDocument,
): vscode.Range | null {
  if (sel.isEmpty) {
    const line = sel.active.line
    const textRange = findNumberTextRange(document.lineAt(line).text, sel.active.character)
    if (!textRange) return null
    return new vscode.Range(line, textRange[0], line, textRange[1])
  } else {
    return sel
  }
}

export function findNumberTextRange(text: string, offset: number): [number, number] | null {
  let end = offset
  if (end + 1 < text.length && text[end] === "-" && isDigit(text[end + 1])) {
    end += 2
    while (end < text.length && isDigit(text[end])) {
      end++
    }
    return [offset, end]
  }
  while (end < text.length && isDigit(text[end])) {
    end++
  }

  let start = offset
  while (start > 0 && isDigit(text[start - 1])) {
    start--
  }
  if (start === end) return null
  if (start > 0 && text[start - 1] === "-") {
    start--
  }

  return [start, end]
}

export function isDigit(char: string): boolean {
  return char >= "0" && char <= "9"
}
