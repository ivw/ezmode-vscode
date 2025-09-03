import { EventEmitter } from "vscode"
import {
  createCursorColorAction,
  createPopupAction,
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

export function addBindingToModeEnv(modeEnv: ModeEnv, keyBinding: KeyBinding) {
  modeEnv.keyBindings.set(keyBinding.key, keyBinding)
}

let env: EzEnv = {
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
const envChangeEmitter = new EventEmitter<EzEnv>()
export const onEnvChange = envChangeEmitter.event

export function getEnv(): EzEnv {
  return env
}

export function setEnv(newEnv: EzEnv) {
  env = newEnv
  envChangeEmitter.fire(newEnv)
}

const keybindings: Array<KeyBinding> = [
  { key: "a", action: createVsCodeEzAction("editor.action.addSelectionToNextFindMatch") },
  { key: "A", action: createVsCodeEzAction("editor.action.selectAll") },
  { key: "t", action: createSwitchModeAction("type") },
  { key: ENTER_MODE_KEY, action: createCursorColorAction("#ff6200") },
  { key: EXIT_MODE_KEY, action: createPopupAction("Exited ez mode") },
]
keybindings.forEach((it) => addBindingToModeEnv(env.modes[0], it))
addBindingToModeEnv(env.modes[1], { key: DEFAULT_KEY, action: nativeEzAction })
addBindingToModeEnv(env.modes[1], {
  key: ENTER_MODE_KEY,
  action: createCursorColorAction("default"),
})
