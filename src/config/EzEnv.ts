import { getMode } from "../mode/ModeState"
import { getEnv } from "./EnvState"

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
  description: string
}

export type EzAction = (key: string | null) => Thenable<unknown> | void

export const DEFAULT_KEY = "default"

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

export function performActionForKey(
  key: string,
  mode: string = getMode(),
  env: EzEnv = getEnv(),
): Thenable<unknown> | void {
  const modeEnv = getModeEnv(env, mode)
  if (!modeEnv) return

  const keyBinding = getKeyBindingOrDefault(modeEnv, key)
  if (!keyBinding) return

  return keyBinding.action(key)
}
