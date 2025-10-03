import * as vscode from "vscode"
import type { Delim } from "./Delim"

export type QuoteDelim = Delim & {
  char: string

  /**
   * If the caret is at the closing quote, finds the opening quote, else finds the closing quote.
   */
  findAuto: (editor: vscode.TextEditor, offset: number) => number | null
}

function isCharEscaped(text: string, offset: number): boolean {
  return offset > 0 && text[offset - 1] == "\\"
}

export function quoteDelim(char: string): QuoteDelim {
  const findDelim: Delim["findDelim"] = (findClosingDelim, editor, offset, ignoreMatchAtCaret) => {
    const text = editor.document.getText()

    if (findClosingDelim) {
      for (let i = offset; i < text.length; i++) {
        if (text[i] === char && !(ignoreMatchAtCaret && i === offset) && !isCharEscaped(text, i)) {
          return i
        }
      }
    } else {
      for (let i = offset - 1; i >= 0; i--) {
        if (
          text[i] === char &&
          !(ignoreMatchAtCaret && i === offset - 1) &&
          !isCharEscaped(text, i)
        ) {
          return i + 1
        }
      }
    }

    return null
  }
  return {
    char,
    findDelim,
    findAuto: (editor, offset) => {
      const text = editor.document.getText()
      return findDelim(
        offset < text.length - 1 && text.charAt(offset) != char,
        editor,
        offset,
        false,
      )
    },
    getMatchingDelim: () => {
      return null
    }, // TODO
    toNiceString: () => char,
  }
}
