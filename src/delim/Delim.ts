import * as vscode from "vscode"
import { allPairDelims } from "./PairDelim"
import { allQuoteDelims } from "./QuoteDelim"
import { changeSelectionRange } from "../Utils"

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
    position: vscode.Position,
  ) => DelimRanges | null

  toNiceString: (isClosingDelim: boolean) => string
}

export type DelimRanges = {
  insideRange: vscode.Selection
  aroundRange: vscode.Selection
}

export function delimRangesFixed(
  insideRange: vscode.Selection,
  delimLength: number = 1,
): DelimRanges {
  return {
    insideRange,
    aroundRange: changeSelectionRange(
      insideRange,
      insideRange.start.translate(0, -delimLength),
      insideRange.end.translate(0, delimLength),
    ),
  }
}

export const getAllDelims = (): Array<Delim> => [...allPairDelims, ...allQuoteDelims]

export function getMatchingDelimEitherSide(
  editor: vscode.TextEditor,
  sel: vscode.Selection,
): DelimRanges | null {
  const delims = getAllDelims()
  for (const delim of delims) {
    const matchingDelim = delim.getMatchingDelim(false, editor, sel.start)
    if (matchingDelim !== null) return matchingDelim
  }
  for (const delim of delims) {
    const matchingDelim = delim.getMatchingDelim(true, editor, sel.end)
    if (matchingDelim !== null) return matchingDelim
  }
  return null
}
