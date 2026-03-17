import * as vscode from "vscode"
import { isLoadingConfig } from "./LoadConfig"
import { getMode } from "../mode/ModeState"
import { registerCommand } from "../utils/Commands"
import { nativeEzAction } from "./EzActions"

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

export function getActionBasedOnMode(key: string, mode: string = getMode()): EzAction | null {
  const modeConfig = getModeConfig(mode)
  if (!modeConfig) return null

  const keyBinding = modeConfig.keyBindings.get(key) ?? modeConfig.keyBindings.get(DEFAULT_KEY)
  if (!keyBinding) return null

  return keyBinding.action
}

export function handleKeyBasedOnMode(
  key: string,
  mode: string = getMode(),
): Thenable<unknown> | void {
  return getActionBasedOnMode(key, mode)?.(key)
}

export function activateModalTypeHandler(context: vscode.ExtensionContext) {
  // Override the default typing handler
  registerCommand(context, "type", (args) => {
    const key = args.text as string
    handleKeyBasedOnMode(key)
  })

  registerCommand(context, "replacePreviousChar", (args) => {
    if (typeof args?.text !== "string" || args.text.length === 0) return
    const key: string = args.text[0]
    const action = getActionBasedOnMode(key)
    if (action) {
      if (action === nativeEzAction) {
        vscode.commands.executeCommand("default:replacePreviousChar", args)
      } else {
        action(key)
      }
    }
  })
}
