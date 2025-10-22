import * as vscode from "vscode"
import * as git from "../../typings/git"
import { registerCommand } from "../utils/Commands"

export function activateNextChangedFile(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.nextChangedFile", (args) => {
    const gitAPI = getGitAPI()
    if (!gitAPI) return
    const repo = gitAPI.repositories[0]
    if (!repo) return

    const changes = repo.state.workingTreeChanges
    if (changes.length <= 1) return

    console.log(changes.map((change) => change.uri))
    const uris = changes.map((change) => change.uri).sort(compareUris)
    console.log(uris)

    const currentUri = getCurrentUri()
    const i = currentUri ? uris.findIndex((uri) => uri.fsPath === currentUri.fsPath) : -1

    const nextI = (args?.reversed ? i - 1 + uris.length : i + 1) % uris.length

    return vscode.commands.executeCommand("git.openChange", uris[nextI])
  })
}

function compareUris(a: vscode.Uri, b: vscode.Uri): number {
  const aParts = a.path.toLowerCase().split("/")
  const bParts = b.path.toLowerCase().split("/")

  if (aParts.length > bParts.length) return 1
  if (aParts.length < bParts.length) return -1

  return a.fsPath.localeCompare(b.fsPath)
}

function compareUris2(a: vscode.Uri, b: vscode.Uri): number {
  const aParts = a.path.toLowerCase().split("/")
  const bParts = b.path.toLowerCase().split("/")

  const len = Math.min(aParts.length, bParts.length)
  for (let i = 0; i < len; i++) {
    if (aParts[i] < bParts[i]) return -1
    if (aParts[i] > bParts[i]) return 1
  }
  if (aParts.length < bParts.length) return -1
  if (aParts.length > bParts.length) return 1
  return 0
}

function getGitAPI() {
  // See: https://github.com/microsoft/vscode/tree/main/extensions/git#api
  const gitExtension = vscode.extensions.getExtension<git.GitExtension>("vscode.git")?.exports
  if (!gitExtension) return null
  return gitExtension.getAPI(1)
}

function getCurrentUri(): vscode.Uri | null {
  const editor = vscode.window.activeTextEditor
  if (!editor) return null
  return editor.document.uri
}
