import * as vscode from "vscode"
import * as os from "os"
import { parseEzModeRc } from "./Parser"
import type { EzAction } from "./EzAction"
import baseRcString from "./BaseEzModeRc"
import templateRcString from "./TemplateEzModeRc"

let baseActions: EzAction[] = []
try {
  baseActions = parseEzModeRc(baseRcString)
} catch (e) {
  vscode.window.showErrorMessage(`Error parsing built-in ezmode config: ${e}`)
}

const homeDirUri = vscode.Uri.file(os.homedir())
export const userRcUri = vscode.Uri.joinPath(homeDirUri, ".ezmoderc")
export const userVsCodeRcUri = vscode.Uri.joinPath(homeDirUri, ".vscode.ezmoderc")

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function fileExists(uri: vscode.Uri): Thenable<boolean> {
  return vscode.workspace.fs.stat(uri).then(
    () => true,
    () => false,
  )
}

export async function createRcFileIfNotExists(uri: vscode.Uri) {
  if (await fileExists(uri)) return
  const content = encoder.encode(templateRcString)
  await vscode.workspace.fs.writeFile(uri, content)
}

async function readFileToString(uri: vscode.Uri): Promise<string> {
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

export async function getConfig() {
  const userRcActions = await parseUserRcFileIfExists(userRcUri)
  const userVsCodeRcActions = await parseUserRcFileIfExists(userVsCodeRcUri)
  return [...baseActions, ...userRcActions, ...userVsCodeRcActions]
}
