import * as vscode from "vscode"

// export interface Delim {
//   findOpeningDelim(
//     editor: vscode.TextEditor,
//     caretOffset: number,
//     ignoreMatchAtCaret: boolean,
//   ): number | null

//   findClosingDelim(
//     editor: vscode.TextEditor,
//     caretOffset: number,
//     ignoreMatchAtCaret: boolean,
//   ): number | null

//   getMatchingDelim(
//     fromClosingDelim: boolean,
//     editor: vscode.TextEditor,
//     caretOffset: number,
//   ): DelimRanges | null

//   toNiceString(isClosingDelim: boolean): string
// }

export type Delim = {
  findDelim: (
    findClosingDelim: boolean,
    editor: vscode.TextEditor,
    offset: number,
    ignoreMatchAtCaret: boolean,
  ) => number | null

  getMatchingDelim: (
    fromClosingDelim: boolean,
    editor: vscode.TextEditor,
    caretOffset: number,
  ) => DelimRanges | null

  toNiceString: (isClosingDelim: boolean) => string
}

export type DelimRanges = {
  insideRange: vscode.Range
  aroundRange: vscode.Range
}

export function delimRangesFixed(insideRange: vscode.Range, delimLength: number = 1): DelimRanges {
  return {
    insideRange,
    aroundRange: new vscode.Range(
      insideRange.start.translate(0, -delimLength),
      insideRange.end.translate(0, delimLength),
    ),
  }
}

// export function findDelim(
//   delim: Delim,
//   isClosingDelim: boolean,
//   editor: vscode.TextEditor,
//   caretOffset: number,
//   ignoreMatchAtCaret: boolean,
// ): number | null {
//   return isClosingDelim
//     ? delim.findClosingDelim(editor, caretOffset, ignoreMatchAtCaret)
//     : delim.findOpeningDelim(editor, caretOffset, ignoreMatchAtCaret)
// }
