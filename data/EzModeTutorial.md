# EzMode Tutorial

Welcome to EzMode - fast and intuitive modal editing for modern IDEs.

To enter EzMode, press Escape. The cursor will turn orange,
and the mode indicator in the bottom-right corner will show "ez".
In EzMode, character keys are mapped to actions. Ctrl/Alt shortcuts still work normally.

To return to typing, press `t`. In type mode, everything behaves as usual.


## Basic keyboard editing

Most of the basic editing actions are on the left-hand side of the keyboard,
so you can use them with your right hand on the mouse.

Try the exercises below:

- Select the word FOO using `a` and copy it with `c`
- Select the word BAR using `a` and paste over it with `v`
- Select the contents of "this string" using `q` and copy with `c`
- Select the contents of (these parentheses) using `q` and delete with `d`.
  *Make sure the cursor is next to a parenthesis*
- Select the contents of "this other string" using `q` and paste over it with `v`
- Remove this line using `r`
- Duplicate this line using `V`


## Two-handed keyboard editing

Instead of using the mouse, you can move the cursor with the right-hand keys.
This is handy when both hands are already on the keyboard from typing.

Use `i`, `j`, `k`, `l` to move, just like the arrow keys.

`u` / `o`: Move backward/forward by word
`h` / `;`: Move to the start/end of a line
`H` / `:`: Move to the start/end of a file
`m` / `M`: Scroll half a page down/up

You can jump right to any character by pressing Space, then typing that character.


### Selecting text

Press `e` to enter select mode, then use movement keys (see above) to extend the selection.
Select mode is automatically activated whenever something is selected in EzMode.

Press `t` to type over the selection, `c` to copy, `d` to delete, or `e` to unselect.

```
Exercise: select THIS_WORD and change it to something else.
```
*Hint: combine "select word" and "type": `at`*

```
Exercise: keep this part. Delete this part.
```
*Hint: don't forget `;` from the previous section.*

```
exercise: make this whole line upper case
```
*Hint: use `~` to toggle case.*


## Brackets and quotes

Use `'` or `"` to jump to the surrounding quote,
or `{}` or `()` to jump to the opening/closing bracket.
With the cursor next to the bracket or quote:
`q`: Select inside the brackets or quotes
`Q`: Select around the brackets or quotes
`-`: Remove the brackets or quotes
`_`: Remove the brackets or quotes and select the contents

```
exercise(remove, these, arguments)
```

```
exercise + (remove + parentheses)
```

```
exercise('Change the quotes to double quotes')
```
*Hint: After removing the quotes, use `T"` to surround the selection with double quotes.*


## Multiple cursors

Press `0` to add the next match of the current selection.
Press `9` to remove the last added cursor.

```
Exercise: Change every 0 to a 1: 0 0 0 0 0
```

```
Exercise: Remove the number next to every x: x0 x1 x2 x3 x4
```
*Hint: Press `e` to exit select mode while keeping the multiple cursors.*

---

Press `8`/`*` to add a new cursor below/above.

```
Exercise: Add a dash to the start of these 3 sentences.
Including this one.
And this one.
```


## Files and windows

Use `p` to open any file. Use `w` to close a tab or `W` to close all other tabs.

Use `\` to split the editor into two windows,
or `|` to do the same but without the copy on the left.
Use `=` to move between split windows and `+` to close a split window.

Open the sidebar with the lower number keys:
`1`: File tree, `2`: Local changes, `3`: Terminal.
To focus a tool window, use the above keys with shift.
Use `4` to hide the sidebar and bottom panel.


## Customization

In EzMode, every character key is customizable. You can even define your own modes.
Open your config file by typing `<` in EzMode, and choosing "Edit .ezmoderc".
This will create a template with some examples if the file doesn't already exist.
After editing and saving this file, use `<` again and choose "Reload .ezmoderc".


## Tutorial complete

EzMode has many other useful keys. You can always press ` to see a full list,
or view the keyboard layout here:
https://github.com/ivw/ezmode-vscode/blob/main/KeyboardLayout.png

The full documentation can be found at https://github.com/ivw/ezmode-vscode

Enjoy! If you have suggestions, email me at ivo@ezmode.dev
