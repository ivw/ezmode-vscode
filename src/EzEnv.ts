import { baseActions } from "./EzModeRcFiles"
import { EventEmitter } from "vscode"
import { type EzAction } from "./EzAction"
import { getMode } from "./ModeState"

export type EzEnv = {
  modes: Array<ModeEnv>
  vars: Map<string, string>
}

export type ModeEnv = {
  name: string
  keyBindings: Map<string, KeyBinding>
}

export type KeyBinding = {
  key: string
  action: EzAction
}

export const DEFAULT_KEY = "default"
export const ENTER_MODE_KEY = "entermode"
export const EXIT_MODE_KEY = "exitmode"

export function getModeEnv(env: EzEnv, mode: string): ModeEnv | null {
  return env.modes.find((m) => m.name === mode) ?? null
}

export function getOrAddModeEnv(env: EzEnv, mode: string): ModeEnv {
  let modeEnv = getModeEnv(env, mode)
  if (!modeEnv) {
    modeEnv = { name: mode, keyBindings: new Map() }
    env.modes.push(modeEnv)
  }
  return modeEnv
}

export function getKeyBindingOrDefault(modeEnv: ModeEnv, key: string): KeyBinding | undefined {
  return modeEnv.keyBindings.get(key) ?? modeEnv.keyBindings.get(DEFAULT_KEY)
}

export function addBindingToModeEnv(modeEnv: ModeEnv, keyBinding: KeyBinding) {
  modeEnv.keyBindings.set(keyBinding.key, keyBinding)
}

export function getActionForKey(
  key: string,
  mode: string = getMode(),
  env: EzEnv = getEnv(),
): EzAction | null {
  const modeEnv = getModeEnv(env, mode)
  if (!modeEnv) return null

  return getKeyBindingOrDefault(modeEnv, key)?.action ?? null
}

let env: EzEnv = {
  modes: [],
  vars: new Map(),
}
export const envChangeEmitter = new EventEmitter<EzEnv>()
export const onEnvChange = envChangeEmitter.event

export function getEnv(): EzEnv {
  return env
}

export function setEnv(newEnv: EzEnv) {
  env = newEnv
  envChangeEmitter.fire(newEnv)
}

baseActions.forEach((action) => {
  action.perform({ env, key: null })
})
