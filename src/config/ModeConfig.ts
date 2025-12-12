import * as vscode from "vscode"
import { getMode } from "../mode/ModeState"
import { isLoadingConfig } from "./LoadConfig"

export const DEFAULT_KEY = "default"

export const modeConfigs: Array<ModeConfig> = []

const modeConfigsChangeEmitter = new vscode.EventEmitter<Array<ModeConfig>>()
export const onModeConfigsChange = modeConfigsChangeEmitter.event

export function fireModeConfigsChange() {
  if (isLoadingConfig) return
  modeConfigsChangeEmitter.fire(modeConfigs)
}

export type ModeConfig = {
  name: string
  keyBindings: Map<string, KeyBinding>
}

export type KeyBinding = {
  key: string
  action: EzAction
  description: string
}

export type EzAction = (key: string | null) => Thenable<unknown> | void

export function getModeConfig(mode: string): ModeConfig | null {
  return modeConfigs.find((m) => m.name === mode) ?? null
}

export function getKeyBindingOrDefault(
  modeConfig: ModeConfig,
  key: string,
): KeyBinding | undefined {
  return modeConfig.keyBindings.get(key) ?? modeConfig.keyBindings.get(DEFAULT_KEY)
}

export function addBindingToModeConfig(modeConfig: ModeConfig, keyBinding: KeyBinding) {
  modeConfig.keyBindings.set(keyBinding.key, keyBinding)
  fireModeConfigsChange()
}

export function addBinding(mode: string, keyBinding: KeyBinding) {
  let modeConfig = getModeConfig(mode)
  if (!modeConfig) {
    modeConfig = { name: mode, keyBindings: new Map() }
    modeConfigs.push(modeConfig)
  }
  addBindingToModeConfig(modeConfig, keyBinding)
}

export function performActionForKey(
  key: string,
  mode: string = getMode(),
): Thenable<unknown> | void {
  const modeConfig = getModeConfig(mode)
  if (!modeConfig) return

  const keyBinding = getKeyBindingOrDefault(modeConfig, key)
  if (!keyBinding) return

  return keyBinding.action(key)
}
