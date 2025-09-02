import {
  createSwitchModeAction,
  createVsCodeEzAction,
  nativeEzAction,
  type EzAction,
} from "./EzAction"

export type EzEnv = {
  modes: Array<ModeEnv>
  vars: Map<string, string>
}

export type ModeEnv = {
  name: string
  keyBindings: Map<string | null, KeyBinding>
}

export type KeyBinding = {
  key: string | null
  action: EzAction
}

export function getModeEnv(env: EzEnv, mode: string): ModeEnv | null {
  return env.modes.find((m) => m.name === mode) ?? null
}

export function addBindingToModeEnv(modeEnv: ModeEnv, keyBinding: KeyBinding) {
  modeEnv.keyBindings.set(keyBinding.key, keyBinding)
}

export const env: EzEnv = {
  modes: [
    {
      name: "ez",
      keyBindings: new Map(),
    },
    {
      name: "type",
      keyBindings: new Map(),
    },
  ],
  vars: new Map(),
}

export const keybindings: Array<KeyBinding> = [
  { key: "a", action: createVsCodeEzAction("editor.action.addSelectionToNextFindMatch") },
  { key: "A", action: createVsCodeEzAction("editor.action.selectAll") },
  { key: "t", action: createSwitchModeAction("type") },
]
keybindings.forEach((it) => addBindingToModeEnv(env.modes[0], it))
addBindingToModeEnv(env.modes[1], { key: null, action: nativeEzAction })
