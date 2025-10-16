import * as vscode from "vscode"
import * as os from "os"
import { parseEzModeRc } from "./Parser"
import type { EzAction } from "./EzAction"

const homeDirUri = vscode.Uri.file(os.homedir())
export const userRcUri = vscode.Uri.joinPath(homeDirUri, ".ezmoderc")
export const userVsCodeRcUri = vscode.Uri.joinPath(homeDirUri, ".vscode.ezmoderc")

let baseConfigCache: EzAction[] | null = null

async function parseBaseConfig(context: vscode.ExtensionContext): Promise<EzAction[]> {
  if (baseConfigCache !== null) return baseConfigCache
  try {
    const str = await readFileToString(
      vscode.Uri.joinPath(context.extensionUri, "data", "base.ezmoderc"),
    )
    const actions = parseEzModeRc(str)
    baseConfigCache = actions
    return actions
  } catch (e) {
    vscode.window.showErrorMessage(`Error parsing built-in ezmode config: ${e}`)
    return []
  }
}

const decoder = new TextDecoder()

function fileExists(uri: vscode.Uri): Thenable<boolean> {
  return vscode.workspace.fs.stat(uri).then(
    () => true,
    () => false,
  )
}

export async function createRcFileIfNotExists(context: vscode.ExtensionContext, uri: vscode.Uri) {
  if (await fileExists(uri)) return
  await vscode.workspace.fs.copy(
    vscode.Uri.joinPath(context.extensionUri, "data", "template.ezmoderc"),
    uri,
  )
}

export async function readFileToString(uri: vscode.Uri): Promise<string> {
  const bytes = await vscode.workspace.fs.readFile(uri)
  return decoder.decode(bytes)
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
