import type { Delim } from "./Delim"

export function pairDelim(openChar: string, closeChar: string): Delim {
  return {
    findDelim: (findClosingDelim, editor, offset, ignoreMatchAtCaret) => {
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
    },
    getMatchingDelim: () => null, // TODO
    toNiceString: (isClosingDelim) => (isClosingDelim ? closeChar : openChar),
  }
}

export const anglePairDelim = pairDelim("<", ">")
