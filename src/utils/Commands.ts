import * as vscode from "vscode"

export function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any[]) => any,
) {
  const disposable = vscode.commands.registerCommand(command, callback)
  context.subscriptions.push(disposable)
}

export function registerTextEditorCommand(
  context: vscode.ExtensionContext,
  command: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void,
) {
  const disposable = vscode.commands.registerTextEditorCommand(command, callback)
  context.subscriptions.push(disposable)
}

type CommandObj = { command: string; title: string }

const commandObjs: Array<CommandObj> | undefined =
  vscode.extensions.getExtension("ivw.ezmode")?.packageJSON?.contributes?.commands

export function getCommandTitle(id: string) {
  const commandObj = commandObjs?.find(({ command }) => command === id)
  return commandObj?.title ?? id
}
