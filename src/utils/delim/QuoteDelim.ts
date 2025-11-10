import * as vscode from "vscode"
import { delimRangesFixed, type Delim, type DelimRangePurpose, type DelimRanges } from "./Delim"

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

  function findDelimRanges(
    editor: vscode.TextEditor,
    sel: vscode.Selection,
    purpose: DelimRangePurpose,
  ): DelimRanges | null {
    const pos = sel.active
    const line = editor.document.lineAt(pos).text
    if (line.length > 1000) return null

    let openingQuote: number | null = null
    for (let i = 0; i < line.length; i++) {
      if (line[i] === char && !isCharEscaped(line, i)) {
        if (openingQuote === null) {
          openingQuote = i
        } else {
          if (i >= pos.character - 1) {
            const ranges = delimRangesFixed(
              new vscode.Selection(
                pos.with({ character: openingQuote + 1 }),
                pos.with({ character: i }),
              ),
            )
            const isSameSelection =
              (purpose === "selectInside" && sel.isEqual(ranges.insideRange)) ||
              (purpose === "selectAround" && sel.isEqual(ranges.aroundRange))
            if (!isSameSelection) return ranges
          }
          openingQuote = null
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
    findDelimRanges,
    toNiceString: () => char,
  }
}

export const quoteDelims: Record<string, QuoteDelim> = {
  double: quoteDelim('"'),
  single: quoteDelim("'"),
  backtick: quoteDelim("`"),
}
export const allQuoteDelims = [quoteDelims.double, quoteDelims.single, quoteDelims.backtick]
