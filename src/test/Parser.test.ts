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
    const descriptions = [
      "Switch mode to: test",
      "Command: workbench.action.toggleSidebarVisibility",
      "Write: Hello world!",
      "Display notification: Hi.",
      "Native",
      "Set variable 'myVar' to 'someValue'",
      "Map 'j' in mode 'ez' to: Command: workbench.action.navigateDown",
    ]
    assert.strictEqual(actions.length, descriptions.length)
    descriptions.forEach((desc, index) => {
      assert.strictEqual(actions[index].description, desc)
    })
  })
})
