import * as vscode from "vscode"
import * as git from "../../typings/git"
import { registerCommand } from "../utils/Commands"

export function activateNextChangedFile(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.nextChangedFile", (args) => {
    const gitAPI = getGitAPI()
    if (!gitAPI) return
    const repo = gitAPI.repositories[0]
    if (!repo) return

    // Using only the workingTreeChanges because the indexChanges don't get highlighted in the sidebar for some reason.
    // Also, you may not want to view the changes you've already staged.
    const changes = repo.state.workingTreeChanges
    if (changes.length <= 1) return

    const uris = changes.map((change) => change.uri).sort(compareUris)

    const currentUri = getCurrentUri()
    const i = currentUri ? uris.findIndex((uri) => uri.fsPath === currentUri.fsPath) : -1
    const nextI = getNextIndex(i, uris.length, args?.reversed)
    return vscode.commands.executeCommand("git.openChange", uris[nextI])
  })
}

function getNextIndex(i: number, length: number, reversed: boolean): number {
  if (i < 0) {
    return reversed ? length - 1 : 0
  }
  return (reversed ? i - 1 + length : i + 1) % length
}

/**
 * Orders files the same way as the list view does: files before folders if at the same depth.
 */
function compareUris(a: vscode.Uri, b: vscode.Uri): number {
  const aParts = a.path.toLowerCase().split("/")
  const bParts = b.path.toLowerCase().split("/")
  for (let i = 0; i < aParts.length; i++) {
    const aIsFile = aParts.length - 1 === i
    const bIsFile = bParts.length - 1 === i
    if (aIsFile && !bIsFile) return -1
    if (!aIsFile && bIsFile) return 1

    if (aParts[i] < bParts[i]) return -1
    if (aParts[i] > bParts[i]) return 1
  }
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
