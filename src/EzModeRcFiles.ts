import * as vscode from "vscode"
import * as os from "os"
import { parseEzModeRc } from "./config/Parser"
import type { EzAction } from "./config/EzAction"
import baseRcString from "./config/BaseEzModeRc"
import templateRcString from "./config/TemplateEzModeRc"

export let baseActions: EzAction[] = []
try {
  baseActions = parseEzModeRc(baseRcString)
} catch (e) {
  vscode.window.showErrorMessage(`Error parsing built-in ezmode keybindings: ${e}`)
}

const homeDirUri = vscode.Uri.file(os.homedir())
export const userRcUri = vscode.Uri.joinPath(homeDirUri, ".ezmoderc")
export const userVsCodeRcUri = vscode.Uri.joinPath(homeDirUri, ".vscode.ezmoderc")

export function fileExists(uri: vscode.Uri): Thenable<boolean> {
  return vscode.workspace.fs.stat(uri).then(
    () => true,
    () => false,
  )
}

export async function createRcFileIfNotExists(uri: vscode.Uri) {
  if (await fileExists(uri)) return
  const content = new TextEncoder().encode(templateRcString)
  await vscode.workspace.fs.writeFile(uri, content)
}

// export async function getEzModeRcUri(): Promise<vscode.Uri | null> {
//   if (await fileExists(userVsCodeRcUri)) {
//     return userVsCodeRcUri
//   }
//   if (await fileExists(userRcUri)) {
//     return userRcUri
//   }
//   return null
// }
