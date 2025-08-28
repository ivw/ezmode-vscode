import type { EzAction } from "./EzAction"

export type EzEnv = {
  modes: Array<ModeEnv>
  vars: Map<String, String>
}

export type ModeEnv = {
  name: string
  keyBindings: Map<String, KeyBinding>
}

export type KeyBinding = {
  key: string
  action: EzAction
}

export const keybindings: Array<KeyBinding> = []
