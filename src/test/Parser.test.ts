import * as assert from "assert"
import { parseEzModeRc } from "../config/Parser"

suite("Parser", () => {
  test("parseEzModeRc", () => {
    const actions = parseEzModeRc(`
      mode test
      vscode workbench.action.toggleSidebarVisibility
      write Hello world!
      popup Hi.
      native
      set myVar someValue
      map ez j <vscode workbench.action.navigateDown>
    `)
    assert.strictEqual(actions.length, 7)
  })
})
