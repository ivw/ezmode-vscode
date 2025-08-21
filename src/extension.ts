import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("type", (args) => {
    const text = args.text as string

    if (text === "a") {
      vscode.window.showInformationMessage("a")
      return
    }

    return vscode.commands.executeCommand("default:type", { text })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
