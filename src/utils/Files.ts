import * as vscode from "vscode"
import * as os from "os"

const homeDirUri = vscode.Uri.file(os.homedir())

const decoder = new TextDecoder()

export function getHomeUri(filename: string): vscode.Uri {
  return vscode.Uri.joinPath(homeDirUri, filename)
}

export function getDataUri(context: vscode.ExtensionContext, filename: string): vscode.Uri {
  return vscode.Uri.joinPath(context.extensionUri, "data", filename)
}

export function fileExists(uri: vscode.Uri): Thenable<boolean> {
  return vscode.workspace.fs.stat(uri).then(
    () => true,
    () => false,
  )
}

export async function readFileToString(uri: vscode.Uri): Promise<string> {
  const bytes = await vscode.workspace.fs.readFile(uri)
  return decoder.decode(bytes)
}
