import * as vscode from "vscode"
import type { Delim } from "./Delim"

export type QuoteDelim = Delim & {
  char: string

  /**
   * If the caret is at the opening quote, finds the closing quote, else finds the opening quote.
   */
  findAuto: (editor: vscode.TextEditor, offset: number) => number | null
}

function isCharEscaped(text: string, offset: number): boolean {
  return offset > 0 && text[offset - 1] == "\\"
}

export function quoteDelim(char: string): QuoteDelim {
  const findDelim = (
    findClosingDelim: boolean,
    editor: vscode.TextEditor,
    offset: number,
    ignoreMatchAtCaret: boolean,
  ) => {
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
    findAuto: (editor, offset) =>
      findDelim(
        offset <= 1 || editor.document.getText().charAt(offset - 1) == char,
        editor,
        offset,
        false,
      ),
    getMatchingDelim: () => null, // TODO
    toNiceString: (isClosingDelim) => char,
  }
}
