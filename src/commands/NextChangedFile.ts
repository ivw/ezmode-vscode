import * as vscode from "vscode"
import { registerCommand } from "../utils/Commands"
import { getCurrentUri, getChanges } from "../utils/Git"

export function activateNextChangedFile(context: vscode.ExtensionContext) {
  registerCommand(context, "ezmode.nextChangedFile", (args) => {
    const uris = getChanges()
    if (uris.length <= 1) return

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
