import * as vscode from "vscode"
import type { EzAction, EzEnv } from "./EzEnv"
import { getConfig } from "./EzModeRcFiles"

function createEmptyEnv(): EzEnv {
  return {
    modes: [],
    vars: new Map(),
  }
}

export async function loadConfig(context: vscode.ExtensionContext) {
  const actions = await getConfig(context)
  actions.forEach((action) => {
    action(null)
  })
  envChangeEmitter.fire(env)
}

let env: EzEnv = createEmptyEnv()

export function getEnv(): EzEnv {
  return env
}

const envChangeEmitter = new vscode.EventEmitter<EzEnv>()
export const onEnvChange = envChangeEmitter.event

export async function reloadConfig(context: vscode.ExtensionContext) {
  env = createEmptyEnv()
  await loadConfig(context)
  vscode.window.showInformationMessage("Reloaded .ezmoderc")
}

export function performSingleAction(action: EzAction) {
  action(null)
  envChangeEmitter.fire(env)
}
