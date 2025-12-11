import * as vscode from "vscode"
import type { EzEnv } from "./EzEnv"
import { getConfig } from "./EzModeRcFiles"

let env: EzEnv = createEmptyEnv()

export function getEnv(): EzEnv {
  return env
}

function createEmptyEnv(): EzEnv {
  return {
    modes: [],
    vars: new Map(),
  }
}

const envChangeEmitter = new vscode.EventEmitter<EzEnv>()
export const onEnvChange = envChangeEmitter.event
let isLoadingConfig = false

export function fireEnvChange() {
  if (isLoadingConfig) return
  envChangeEmitter.fire(env)
}

export async function loadConfig(context: vscode.ExtensionContext) {
  isLoadingConfig = true
  const actions = await getConfig(context)
  actions.forEach((action) => {
    action(null)
  })
  isLoadingConfig = false
  envChangeEmitter.fire(env)
}

export async function reloadConfig(context: vscode.ExtensionContext) {
  env = createEmptyEnv()
  await loadConfig(context)
  vscode.window.showInformationMessage("Reloaded .ezmoderc")
}
