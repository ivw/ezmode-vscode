import * as vscode from "vscode"
import type { EzEnv } from "./EzEnv"
import type { EzAction } from "./EzAction"
import { getConfig } from "./EzModeRcFiles"

function createEmptyEnv(): EzEnv {
  return {
    modes: [],
    vars: new Map(),
  }
}

async function loadConfig() {
  const actions = await getConfig()
  actions.forEach((action) => {
    action.perform({ env, key: null })
  })
}

let env: EzEnv = createEmptyEnv()
loadConfig()

export function getEnv(): EzEnv {
  return env
}

const envChangeEmitter = new vscode.EventEmitter<EzEnv>()
export const onEnvChange = envChangeEmitter.event

export async function reloadConfig() {
  env = createEmptyEnv()
  await loadConfig()
  envChangeEmitter.fire(env)
  vscode.window.showInformationMessage("Reloaded .ezmoderc")
}

export function performSingleAction(action: EzAction) {
  action.perform({ env, key: null })
  envChangeEmitter.fire(env)
}
