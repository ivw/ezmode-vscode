import * as vscode from "vscode"
import { parseEzModeRc } from "./Parser"
import type { EzAction } from "./EzAction"

const baseRcString = `
map type default <native>
map typeonce default <native><mode ez>


map ez ~ <vscode ezmode.ToggleCase.TODO>
map ez \` <quote \`>
map ez 1 <vscode workbench.view.explorer><vscode workbench.view.explorer> // TODO
map ez ! <vscode workbench.view.explorer>
map ez 2 <vscode workbench.view.scm><vscode workbench.view.scm> // TODO
map ez @ <vscode workbench.view.scm>
map ez 3 <vscode workbench.action.terminal.toggleTerminal> // TODO
map ez # <vscode workbench.action.terminal.toggleTerminal>
map ez 4 <vscode workbench.action.closePanel> // TODO
map ez $ <vscode workbench.action.closePanel> // TODO
map ez 5 <vscode ezmode.ToggleCheatSheet> // TODO
map ez 7 <mode special>
map ez 8 <vscode editor.action.goToImplementation>
map ez 9 <vscode editor.action.moveSelectionToPreviousFindMatch>
map ez ( <pair open ()>
map ez 0 <vscode editor.action.addSelectionToNextFindMatch>
map ez ) <pair close ()>
map ez - <vscode editor.action.selectToBracket {"selectBrackets": false}>
map ez = <vscode editor.action.selectToBracket>
map ez _ <vscode editor.action.removeBrackets>

map ez q <vscode workbench.action.focusNextGroup>
map ez Q <vscode workbench.action.closeEditorsInGroup>
map ez w <vscode workbench.action.closeActiveEditor>
map ez W <vscode workbench.action.closeOtherEditors>
map ez e <mode select>
map ez E <vscode ezmode.selectLine><mode select>
map ez r <vscode editor.action.deleteLines>
map ez R <vscode editor.action.deleteLines><vscode cursorUp>
map ez t <mode type>
map ez T <mode typeonce>
map ez y <vscode redo>
map ez u <vscode cursorWordLeft>
map ez U <vscode deleteWordLeft>
map ez i <vscode cursorUp>
map ez I <vscode cursorMove {"to": "prevBlankLine"}>
map ez o <vscode cursorWordRight>
map ez O <vscode deleteWordRight>
map ez p <vscode workbench.action.quickOpen>
map ez P <vscode workbench.action.showCommands>
map ez [ <vscode workbench.action.previousEditorInGroup>
map ez { <pair open {} xml>
map ez ] <vscode workbench.action.nextEditorInGroup>
map ez } <pair close {} xml>
map ez \\ <vscode workbench.action.splitEditor>
map ez | <vscode workbench.action.moveEditorToNextGroup>

map ez a <vscode ezmode.selectWord>
map ez A <vscode editor.action.selectAll>
map ez s <vscode workbench.action.files.save>
map ez S <vscode editor.action.formatDocument>
map ez d <vscode deleteRight>
map ez D <vscode deleteLeft>
map ez f <vscode actions.find>
map ez F <vscode workbench.action.findInFiles>
map ez g <mode git>
map ez G <vscode workbench.action.tasks.runTask>
map ez h <vscode cursorHome>
map ez H <vscode cursorTop>
map ez j <vscode cursorLeft>
map ez J <vscode workbench.action.navigateBack>
map ez k <vscode cursorDown>
map ez K <vscode cursorMove {"to": "nextBlankLine"}>
map ez l <vscode cursorRight>
map ez L <vscode workbench.action.navigateForward>
map ez ; <vscode cursorEnd>
map ez : <vscode cursorBottom>
map ez ' <quote '>
map ez " <quote ">
map ez enter <native>

map ez z <vscode undo>
map ez Z <vscode workbench.action.reopenClosedEditor>
map ez x <vscode editor.action.clipboardCutAction>
map ez c <vscode editor.action.clipboardCopyAction><vscode cancelSelection>
map ez v <vscode editor.action.clipboardPasteAction>
map ez V <vscode editor.action.copyLinesDownAction>
map ez b <vscode editor.action.joinLines>
map ez B <vscode cursorUp><vscode editor.action.joinLines>
map ez n <vscode editor.action.insertLineAfter>
map ez N <vscode editor.action.insertLineBefore>
// TODO use something like <scroll 50>. note: editorScroll does not work well.
map ez m <vscode cursorPageDown>
map ez M <vscode cursorPageUp>
map ez , <vscode workbench.action.openSettings>
map ez lt <vscode ezmode.EzModeActionGroupPopup> // TODO
map ez . <vscode editor.action.triggerSuggest>
map ez gt <vscode editor.action.triggerParameterHints>
map ez / <vscode editor.action.commentLine>
map ez ? <vscode editor.action.blockComment>

map ez space <vscode AceAction> // TODO


map select default <ofmode ez>

map select ~ <ofmode ez><mode ez>

map select e <vscode cancelSelection><mode ez> // TODO cancelSelection cancels multicursor
map select r <ofmode ez><mode ez>
map select R <ofmode ez><mode ez>
map select u <vscode cursorWordLeftSelect>
map select U <ofmode ez><mode ez>
map select i <vscode cursorUpSelect>
map select I <vscode cursorMove {"to": "prevBlankLine", "select": true}>
map select o <vscode cursorWordRightSelect>
map select O <ofmode ez><mode ez>

map select d <ofmode ez><mode ez>
map select D <ofmode ez><mode ez>
map select h <vscode cursorHomeSelect>
map select H <vscode cursorTopSelect>
map select j <vscode cursorLeftSelect>
map select k <vscode cursorDownSelect>
map select K <vscode cursorMove {"to": "nextBlankLine", "select": true}>
map select l <vscode cursorRightSelect>
map select ; <vscode cursorEndSelect>
map select : <vscode cursorBottomSelect>

map select x <ofmode ez><mode ez>
map select c <ofmode ez><mode ez>
map select v <ofmode ez><mode ez>
map select , <vscode editor.action.insertCursorAbove>
map select lt <pair open angle>
map select . <vscode editor.action.insertCursorBelow>
map select gt <pair close angle>


map git default <ofmode ez>

map git w <vscode workbench.action.closeActiveEditor><mode ez>
map git r <vscode git.viewChanges> // TODO
map git u <vscode git.sync><mode ez>
map git i <vscode workbench.action.compareEditor.previousChange>
map git p <vscode git.push><mode ez>
map git P <vscode git.pullFrom><mode ez>

map git a <vscode gitlens.toggleFileBlame><mode ez> // TODO uses gitlens
map git s <vscode workbench.scm.history.focus><mode ez>
map git f <vscode git.fetchAll><mode ez>
map git g <mode ez>
map git h <vscode gitlens.showFileHistoryView><mode ez> // TODO need gitlens?
map git j <vscode Diff.PrevChange> // TODO remove?
map git k <vscode workbench.action.compareEditor.nextChange>
map git l <vscode Diff.NextChange> // TODO remove?

map git c <vscode CheckinProject><mode ez> // TODO ?
map git b <vscode git.checkout><mode ez>
map git m <vscode git.merge><mode ez>


map special default <ofmode ez>

map special 7 <mode ez>
map special + <numberop +>
map special - <numberop ->
map special * <numberop *>
map special / <numberop />
map special i <write \${caretindex}><mode ez>
map special f <write \${filename}><mode ez>
map special l <write \${line}><mode ez>
map special c <write \${column}><mode ez>
map special r <vscode editor.action.rename><mode type>
map special R <vscode renameFile><mode ez>
`

export let baseActions: EzAction[] = []
try {
  baseActions = parseEzModeRc(baseRcString)
} catch (e) {
  vscode.window.showErrorMessage(`Error parsing built-in ezmode keybindings: ${e}`)
}
