import * as vscode from "vscode"
import { allPairDelims } from "./PairDelim"
import { allQuoteDelims } from "./QuoteDelim"
import { changeSelectionRange } from "../Selection"

export type Delim = {
  findDelim: (
    findClosingDelim: boolean,
    editor: vscode.TextEditor,
    offset: number,
    ignoreMatchAtCaret: boolean,
  ) => number | null

  findDelimRanges: (
    editor: vscode.TextEditor,
    sel: vscode.Selection,
    purpose: DelimRangePurpose,
  ) => DelimRanges | null
}

export type DelimRanges = {
  insideRange: vscode.Selection
  aroundRange: vscode.Selection
}

export type DelimRangePurpose = "selectInside" | "selectAround" | "removeDelim"

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

export function findDelimRanges(
  editor: vscode.TextEditor,
  sel: vscode.Selection,
  purpose: DelimRangePurpose,
): DelimRanges | null {
  const delims = getAllDelims()
  for (const delim of delims) {
    const delimRanges = delim.findDelimRanges(editor, sel, purpose)
    if (delimRanges !== null) return delimRanges
  }
  return null
}
