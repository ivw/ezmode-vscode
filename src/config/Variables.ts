import * as vscode from "vscode"
import { getMode } from "../mode/ModeState"
import { getEnv } from "./EnvState"

/**
 * Context that may be needed to resolve a variable
 */
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

/**
 * A string that may resolve variables based on context.
 */
export type VarString = string | ((ctx: VarContext) => string | Thenable<string>)

/**
 * The string to represent an undefined variable
 */
export const NULL_VAR = ""

export function resolveVarString(varString: VarString, ctx: VarContext): string | Thenable<string> {
  if (typeof varString === "string") {
    return varString
  } else {
    return varString(ctx)
  }
}

const builtInVarStrings: Record<string, VarString> = {
  caretindex: (ctx) => (ctx.selectionIndex === null ? NULL_VAR : String(ctx.selectionIndex)),
  line: (ctx) => (ctx.selection ? String(ctx.selection.active.line + 1) : NULL_VAR),
  column: (ctx) => (ctx.selection ? String(ctx.selection.active.character + 1) : NULL_VAR),
  selection: (ctx) =>
    ctx.selection && vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.document.getText(ctx.selection)
      : NULL_VAR,
  filename: () => vscode.window.activeTextEditor?.document?.fileName ?? NULL_VAR,
  projectname: () => vscode.workspace.name ?? NULL_VAR,
  mode: getMode,
  key: (ctx) => ctx.key ?? NULL_VAR,
  clipboard: () => vscode.env.clipboard.readText(),
  space: " ",
  tab: "\t",
  nl: "\n",
  doubleslash: "//",
}

function envVarString(varName: string): VarString {
  return () => getEnv().vars.get(varName) ?? NULL_VAR
}

/**
 * Matches a word inside ${}
 */
const varRegex = /\$\{([A-Za-z_]\w*)\}/g

/**
 * Parses a string that may contain ${} variables and turns it into a VarString
 */
export function parseVarString(src: string): VarString {
  return src.split(varRegex).reduce<VarString>((acc, currString, index) => {
    if (currString === "") return acc

    const isCurrStringVarName = index % 2 === 1
    const curr: VarString = isCurrStringVarName
      ? currString in builtInVarStrings
        ? builtInVarStrings[currString]
        : envVarString(currString)
      : currString

    if (acc === "") return curr
    if (typeof acc === "string" && typeof curr === "string") {
      return acc + curr
    }
    return async (ctx) => (await resolveVarString(acc, ctx)) + (await resolveVarString(curr, ctx))
  }, "")
}
