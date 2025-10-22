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
    if (changes.length <= 0) return

    const currentFile = getCurrentFile()
    const i = currentFile
      ? changes.findIndex((change) => change.uri.fsPath === currentFile.fsPath)
      : -1

    const nextI = args?.reversed
      ? (i - 1 + changes.length) % changes.length
      : (i + 1) % changes.length

    return vscode.commands.executeCommand("git.openChange", changes[nextI].uri)
  })
}

function getGitAPI() {
  // See: https://github.com/microsoft/vscode/tree/main/extensions/git#api
  const gitExtension = vscode.extensions.getExtension<git.GitExtension>("vscode.git")?.exports
  if (!gitExtension) return null
  return gitExtension.getAPI(1)
}

function getCurrentFile(): vscode.Uri | null {
  const editor = vscode.window.activeTextEditor
  if (!editor) return null
  return editor.document.uri
}
