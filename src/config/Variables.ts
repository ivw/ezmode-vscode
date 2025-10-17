import * as vscode from "vscode"
import { getMode } from "../mode/ModeState"
import { getEnv } from "./EnvState"

export type VarContext = {
  key: string | null
  selection: vscode.Selection | null
  selectionIndex: number | null
}

export function varContext(
  key: string | null,
  selection: vscode.Selection | null = vscode.window.activeTextEditor?.selection ?? null,
  selectionIndex: number | null = null,
): VarContext {
  return { key, selection, selectionIndex }
}

export function resolveVar(varName: string, ctx: VarContext): string | null {
  switch (varName) {
    case "caretindex":
      return ctx.selectionIndex === null ? null : String(ctx.selectionIndex)
    case "line":
      return ctx.selection ? String(ctx.selection.active.line + 1) : null
    case "column":
      return ctx.selection ? String(ctx.selection.active.character + 1) : null
    case "selection":
      return ctx.selection && vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.document.getText(ctx.selection)
        : null
    case "filename":
      return vscode.window.activeTextEditor?.document?.fileName ?? null
    case "projectname":
      return vscode.workspace.name ?? null
    case "mode":
      return getMode()
    case "key":
      return ctx.key
    case "space":
      return " "
    case "tab":
      return "\t"
    case "nl":
      return "\n"
    case "doubleslash":
      return "//"
    default:
      return getEnv().vars.get(varName) ?? null
  }
}

/**
 * Matches a word inside ${}
 */
const varRegex = /\$\{([A-Za-z_]\w*)\}/g

export function resolveVars(str: string, ctx: VarContext): string {
  return str.replace(varRegex, (_, varName: string) => resolveVar(varName, ctx) ?? "")
}
