import * as vscode from "vscode"
import * as git from "../../typings/git"

export function isDiffEditor(): boolean {
  return vscode.window.tabGroups.activeTabGroup.activeTab?.input instanceof vscode.TabInputTextDiff
}

export function getGitAPI() {
  // See: https://github.com/microsoft/vscode/tree/main/extensions/git#api
  const gitExtension = vscode.extensions.getExtension<git.GitExtension>("vscode.git")?.exports
  if (!gitExtension) return null
  return gitExtension.getAPI(1)
}

export function getChanges(): Array<vscode.Uri> {
  const gitAPI = getGitAPI()
  if (!gitAPI) return []
  const repo = gitAPI.repositories[0]
  if (!repo) return []

  // Using only the workingTreeChanges because the indexChanges don't get highlighted in the sidebar for some reason.
  // Also, you may not want to view the changes you've already staged.
  return repo.state.workingTreeChanges.map((change) => change.uri).sort(compareUris)
}

export function getCurrentUri(): vscode.Uri | null {
  const editor = vscode.window.activeTextEditor
  if (!editor) return null
  return editor.document.uri
}

/**
 * Orders files the same way as the list view does: files before folders if at the same depth.
 */
export function compareUris(a: vscode.Uri, b: vscode.Uri): number {
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
