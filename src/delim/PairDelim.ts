import * as vscode from "vscode"
import { delimRangesFixed, type Delim } from "./Delim"

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
  return {
    findDelim,
    getMatchingDelim: (
      fromClosingDelim: boolean,
      editor: vscode.TextEditor,
      position: vscode.Position,
    ) => {
      const text = editor.document.getText()
      const offset = editor.document.offsetAt(position)
      if (fromClosingDelim) {
        if (offset < text.length && text[offset] !== closeChar) return null
        const openingDelim = findDelim(false, editor, offset, false)
        if (openingDelim !== null) {
          return delimRangesFixed(
            new vscode.Range(editor.document.positionAt(openingDelim), position),
          )
        }
      } else {
        if (offset > 0 && text[offset - 1] !== openChar) return null
        const closingDelim = findDelim(true, editor, offset, false)
        if (closingDelim !== null) {
          return delimRangesFixed(
            new vscode.Range(position, editor.document.positionAt(closingDelim)),
          )
        }
      }
      return null
    },
    toNiceString: (isClosingDelim) => (isClosingDelim ? closeChar : openChar),
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
