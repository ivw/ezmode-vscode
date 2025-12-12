import * as vscode from "vscode"
import { getConfig } from "./EzModeRcFiles"
import { fireModeConfigsChange, modeConfigs } from "./ModeConfig"
import { fireVarsChange, vars } from "./Variables"

export let isLoadingConfig = false

export async function loadConfig(context: vscode.ExtensionContext) {
  isLoadingConfig = true
  const actions = await getConfig(context)
  actions.forEach((action) => {
    action(null)
  })
  isLoadingConfig = false
  fireModeConfigsChange()
  fireVarsChange()
}

export async function reloadConfig(context: vscode.ExtensionContext) {
  modeConfigs.length = 0
  vars.clear()
  await loadConfig(context)
  vscode.window.showInformationMessage("Reloaded .ezmoderc")
}
