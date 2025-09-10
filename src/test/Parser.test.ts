import * as assert from "assert"
import { parseAction, parseActionChain, parseEzModeRc, Scanner } from "../Parser"

suite("Parser", () => {
  suite("parseAction", () => {
    test("mode", () => {
      const action = parseEzModeRc(`
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
      descriptions.forEach((desc, index) => {
        assert.strictEqual(action[index].description, desc)
      })
    })
  })
  // it("should parse switch mode action", () => {
  //   const result = parseEzModeRc(new Scanner("mode test"))
  //   assert.strictEqual(result.length, 1)
  //   assert.strictEqual(result[0].description, "Switch to mode: test")
  // })
  // it("should parse vscode command action", () => {
  //   const result = parseEzModeRc(new Scanner("vscode workbench.action.toggleSidebarVisibility"))
  //   assert.strictEqual(result.length, 1)
  //   assert.strictEqual(result[0].description, "Command: workbench.action.toggleSidebarVisibility")
  // })
  // it("should parse popup action", () => {
  //   const result = parseEzModeRc(new Scanner("popup Hello World!"))
  //   assert.strictEqual(result.length, 1)
  //   assert.strictEqual(result[0].description, "Display notification: Hello World!")
  // })
  // it("should parse native action", () => {
  //   const result = parseEzModeRc(new Scanner("native"))
  //   assert.strictEqual(result.length, 1)
  //   assert.strictEqual(result[0].description, "Native")
  // })
  // it("should parse set variable action", () => {
  //   const result = parseEzModeRc(new Scanner("set myVar someValue"))
  //   assert.strictEqual(result.length, 1)
  //   assert.strictEqual(result[0].description, "Set variable 'myVar' to 'someValue'")
  // })
  // it("should parse map key binding action", () => {
  //   const result = parseEzModeRc(new Scanner("map normal j <vscode workbench.action.navigateDown>"))
  //   assert.strictEqual(result.length, 1)
  //   assert.strictEqual(result[0].type, "map")
  //   assert.strictEqual(result[0].modeName, "normal")
  //   assert.strictEqual(result[0].binding.key, "j")
  // })
  // it("should parse multiple actions", () => {
  //   const result = parseEzModeRc(new Scanner("mode test\nvscode some.command"))
  //   assert.strictEqual(result.length, 2)
  //   assert.strictEqual(result[0].type, "switch-mode")
  //   assert.strictEqual(result[1].type, "vscode")
  // })
  // it("should throw on unknown action type", () => {
  //   assert.throws(() => {
  //     parseEzModeRc(new Scanner("unknown action"))
  //   }, /Unknown action type/)
  // })
})
// describe("parseActionChain", () => {
//   it("should parse single key reference", () => {
//     const result = parseActionChain("j")
//     assert.strictEqual(result.type, "key-reference")
//     assert.strictEqual(result.key, "j")
//   })

//   it("should parse single nested action", () => {
//     const result = parseActionChain("<vscode command.id>")
//     assert.strictEqual(result.type, "vscode")
//     assert.strictEqual(result.commandId, "command.id")
//   })

//   it("should parse composite action chain", () => {
//     const result = parseActionChain("g<mode normal>")
//     assert.strictEqual(result.type, "composite")
//     assert.strictEqual(result.actions.length, 2)
//     assert.strictEqual(result.actions[0].type, "key-reference")
//     assert.strictEqual(result.actions[1].type, "switch-mode")
//   })

//   it("should throw on empty action chain", () => {
//     assert.throws(() => {
//       parseActionChain("")
//     }, /Empty action chain/)
//   })

//   it("should parse multiple nested actions", () => {
//     const result = parseActionChain("<popup hello><mode normal>")
//     assert.strictEqual(result.type, "composite")
//     assert.strictEqual(result.actions.length, 2)
//     assert.strictEqual(result.actions[0].type, "popup")
//     assert.strictEqual(result.actions[1].type, "switch-mode")
//   })
// })
