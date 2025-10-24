import * as vscode from "vscode"
import { registerTextEditorCommand } from "../utils/Commands"
import { getChanges, isDiffEditor } from "../utils/Git"
import { switchMode } from "../mode/ModeState"

export function activateGitReview(context: vscode.ExtensionContext) {
  registerTextEditorCommand(context, "ezmode.gitReview", async () => {
    if (isDiffEditor()) {
      await vscode.commands.executeCommand(`git.openFile`)
      switchMode("ez")
    } else {
      const uris = getChanges()
      await vscode.commands.executeCommand(`git.openChange`, uris[0])
    }
  })
}
