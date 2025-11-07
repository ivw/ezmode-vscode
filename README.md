EzMode is a plugin for Visual Studio Code that brings the power of modal editing, without the steep learning curve.

### What is modal editing?

In a modal editor, keys that normally insert characters can perform different actions based on the current mode.

For example, in EzMode you can press `a` to select a word, and `c` to copy it.
This is less work than double-clicking with your mouse and pressing `Ctrl-c`.

#### Then how do I type?

Press `t` to enter type mode, and press `Escape` to go back to ez mode.

#### So it's like Vim?

Yes, but a lot simpler. EzMode focuses just on *modes*.
It does **not**:
- use any Ctrl or Alt shortcuts
- use a block cursor
- change how copy/paste works
- use `hjkl` for arrow keys. EzMode uses `ijkl`.

EzMode is built for modern IDEs. It works well with viewing diffs,
using multi-cursor, and managing tool windows.

TODO demo

### Keyboard layout

![Keyboard layout](KeyboardLayout.png)
*[View on Keyboard Layout Editor](https://www.keyboard-layout-editor.com/#/gists/aee165d4c5c45849d72647829abe7038)*

---

## Getting Started

TODO
4. Open the [tutorial](data/EzModeTutorial.md) in VS Code by clicking the mode indicator in the bottom-right corner.

## Customization

The full keymap is defined in [base.ezmoderc](data/base.ezmoderc),
which you can override with your own `.ezmoderc` file.

Key mappings use this format:

```
map {mode} {keychar} {actions}
```

### `mode`

The mode in which the key mapping is active. Built-in modes include `ez`, `type`, `select`, and `git`, but you can
define your own as well.

### `keychar`

The character that has to be "typed" to trigger the action. Naturally, uppercase means you have to hold shift.

Ctrl/Alt shortcuts are not characters and not handled by EzMode.

Special values:

- `<space>`: The space character.
- `<default>`: The default key mapping, which will be triggered by any key that does not have a mapping for the given
  mode.

### `actions`

A string of one or more actions with no separators.

You can map an action to the parent keymap by typing its `keychar`,
or you can use a base action:

- `<vscode SomeCommandId>`: Invoke a VSCode command.
- `<mode somemode>`: Switch to a different mode
- `<ofmode somemode>`: Let another mode handle the `keychar`
- `<native>`: Insert the `keychar` into the editor
- `<write Hello world!>`: Insert a string into the editor
- `<pair open/close {}>`: Jump to the opening/closing delimiter defined in the third argument, which must be two characters,
  or `angle` for `<>`, or `xml` for XML/HTML tags. You can list multiple delimiters by separating them with spaces.

### Variables

In actions that take a text argument, you can use variables enclosed in `${}`,
for example: `<write Hello, ${filename}!>`.

- Custom variables: set in your config using `set varname value`
- Built-in variables: `mode`, `key`, `caretindex`, `line`, `column`, `selection`, `filename`, `projectname`
- Escape sequences: `space`, `tab`, `nl` (newline), `doubleslash` (for `//`)

### Examples

Map `C` (Shift + c) in `ez` mode to select all (`A`) and copy (`c`):

```
map ez C Ac
```

Create a mode that types every character twice:

```
map doubletype <default> <native><native>
map ez X <mode doubletype>
```

More practical examples can be found in
the [.ezmoderc template](data/template.ezmoderc)

## Comparison with other modal editors

EzMode doesn't add as many commands as Vim, for example, but EzMode can use any action that's already available in the IDE.

EzMode uses *object-verb* style like Kakoune, rather than Vim's *verb-object* style. A few common examples:

|                           | EzMode | Vim    | Kakoune     |
|---------------------------|--------|--------|-------------|
| Select word               | `a`    | `viw`  | `<Alt-i>w`  |
| Delete word               | `ad`   | `diw`  | `<Alt-i>wd` |
| Copy word                 | `ac`   | `yiw`  | `<Alt-i>wy` |
| Change word               | `at`   | `ciw`  | `<Alt-i>wc` |
| Select line               | `E`    | `V`    | `x`         |
| Delete line               | `r`    | `dd`   | `xd`        |
| Copy line                 | `c`    | `yy`   | `xy`        |
| Change line               | `Et`   | `cc`   | `xc`        |
| Jump to surrounding quote | `'`    | `f'`   | `f'`        |
| Delete surrounding quote  | `'_`   | `ds'`  | -           |
| Change surrounding quote  | `'_T"` | `cs'"` | -           |
