import * as vscode from "vscode"
import { delimRangesFixed, type Delim, type DelimRanges } from "./Delim"

export function pairDelim(openChar: string, closeChar: string): Delim {
  const findDelim: Delim["findDelim"] = (findClosingDelim, editor, offset, ignoreMatchAtCaret) => {
    const text = editor.document.getText()
    let depth = 0

    if (findClosingDelim) {
      for (let i = offset; i < text.length; i++) {
        const char = text[i]
        if (char === closeChar) {
          if (ignoreMatchAtCaret && i === offset) {
            continue
          }
          if (depth === 0) {
            return i
          }
          depth--
        } else if (char === openChar) {
          depth++
        }
      }
    } else {
      for (let i = offset - 1; i >= 0; i--) {
        const char = text[i]
        if (char === openChar) {
          if (ignoreMatchAtCaret && i === offset - 1) {
            continue
          }
          if (depth === 0) {
            return i + 1
          }
          depth--
        } else if (char === closeChar) {
          depth++
        }
      }
    }

    return null
  }

  function findDelimRanges(editor: vscode.TextEditor, sel: vscode.Selection): DelimRanges | null {
    const text = editor.document.getText()
    const offset = editor.document.offsetAt(sel.active)

    // Look for the opening delim to the left and right of the cursor
    for (let i = offset - 1; i <= offset; i++) {
      if (i >= 0 && text[i] === openChar) {
        const closingDelim = findDelim(true, editor, i + 1, false)
        if (closingDelim !== null) {
          return delimRangesFixed(
            new vscode.Selection(
              editor.document.positionAt(i + 1),
              editor.document.positionAt(closingDelim),
            ),
          )
        }
      }
    }

    // Look for the closing delim to the right and left of the cursor
    for (let i = offset; i >= offset - 1; i--) {
      if (i >= 0 && text[i] === closeChar) {
        const openingDelim = findDelim(false, editor, i, false)
        if (openingDelim !== null) {
          return delimRangesFixed(
            new vscode.Selection(
              editor.document.positionAt(openingDelim),
              editor.document.positionAt(i),
            ),
          )
        }
      }
    }

    return null
  }

  return {
    findDelim,
    findDelimRanges,
  }
}

export const pairDelims: Record<string, Delim> = {
  parentheses: pairDelim("(", ")"),
  curly: pairDelim("{", "}"),
  square: pairDelim("[", "]"),
  angle: pairDelim("<", ">"),
}
export const allPairDelims = [
  pairDelims.parentheses,
  pairDelims.curly,
  pairDelims.square,
  pairDelims.angle,
]
