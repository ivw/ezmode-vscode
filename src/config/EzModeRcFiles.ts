import * as vscode from "vscode"
import { parseEzModeRc } from "./Parser"
import type { EzAction } from "./EzAction"
import { fileExists, getDataUri, getHomeUri, readFileToString } from "../utils/Files"

export const userRcUri = getHomeUri(".ezmoderc")
export const userVsCodeRcUri = getHomeUri(".vscode.ezmoderc")

let baseConfigCache: EzAction[] | null = null

async function parseBaseConfig(context: vscode.ExtensionContext): Promise<EzAction[]> {
  if (baseConfigCache !== null) return baseConfigCache
  try {
    const str = await readFileToString(getDataUri(context, "base.ezmoderc"))
    const actions = parseEzModeRc(str)
    baseConfigCache = actions
    return actions
  } catch (e) {
    vscode.window.showErrorMessage(`Error parsing built-in ezmode config: ${e}`)
    return []
  }
}

export async function createRcFileIfNotExists(context: vscode.ExtensionContext, uri: vscode.Uri) {
  if (await fileExists(uri)) return
  await vscode.workspace.fs.copy(getDataUri(context, "template.ezmoderc"), uri)
}

async function parseUserRcFileIfExists(uri: vscode.Uri): Promise<Array<EzAction>> {
  if (!(await fileExists(uri))) return []
  const str = await readFileToString(uri)
  try {
    return parseEzModeRc(str)
  } catch (e) {
    vscode.window.showErrorMessage(`Error parsing ${uri.fsPath}: ${e}`)
    return []
  }
}

export async function getConfig(context: vscode.ExtensionContext) {
  const baseActions = await parseBaseConfig(context)
  const userRcActions = await parseUserRcFileIfExists(userRcUri)
  const userVsCodeRcActions = await parseUserRcFileIfExists(userVsCodeRcUri)
  return [...baseActions, ...userRcActions, ...userVsCodeRcActions]
}
