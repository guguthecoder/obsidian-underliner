'use strict';

const { Plugin } = require('obsidian');

const OPEN = '<u>';
const CLOSE = '</u>';
const UNWRAP_RE = /<u>([\s\S]*?)<\/u>/g;

/** Wrap one line's content in <u>..</u>, keeping indent and trailing spaces outside. */
function wrapLine(line) {
  const m = line.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m || !m[2]) return line;
  return m[1] + OPEN + m[2] + CLOSE + m[3];
}

/** Replace the selection with text and keep text selected. */
function replaceKeepSelection(editor, text) {
  const from = editor.getCursor('from');
  editor.replaceSelection(text);
  const parts = text.split('\n');
  const to = parts.length === 1
    ? { line: from.line, ch: from.ch + text.length }
    : { line: from.line + parts.length - 1, ch: parts[parts.length - 1].length };
  editor.setSelection(from, to);
}

/** True when a single-line selection sits directly inside a <u>..</u> pair. */
function selectionInsideTag(editor) {
  const from = editor.getCursor('from');
  const to = editor.getCursor('to');
  if (from.line !== to.line) return null;
  const line = editor.getLine(from.line);
  if (from.ch < OPEN.length) return null;
  if (!line.slice(0, from.ch).endsWith(OPEN)) return null;
  if (!line.slice(to.ch).startsWith(CLOSE)) return null;
  return { from: from, to: to };
}

function toggle(editor) {
  const selection = editor.getSelection();

  // 1. No selection: toggle a tag pair at the cursor, otherwise insert one.
  if (!selection) {
    const c = editor.getCursor();
    const line = editor.getLine(c.line);
    const before = line.slice(0, c.ch);
    const after = line.slice(c.ch);
    if (before.endsWith(OPEN) && after.startsWith(CLOSE)) {
      editor.replaceRange(
        '',
        { line: c.line, ch: c.ch - OPEN.length },
        { line: c.line, ch: c.ch + CLOSE.length }
      );
      return;
    }
    editor.replaceSelection(OPEN + CLOSE);
    const pos = editor.getCursor();
    editor.setCursor({ line: pos.line, ch: pos.ch - CLOSE.length });
    return;
  }

  // 2. Selection is the inner text of an existing tag pair: strip the pair.
  const inTag = selectionInsideTag(editor);
  if (inTag) {
    const start = inTag.from.ch - OPEN.length;
    editor.replaceRange(
      selection,
      { line: inTag.from.line, ch: start },
      { line: inTag.to.line, ch: inTag.to.ch + CLOSE.length }
    );
    editor.setSelection(
      { line: inTag.from.line, ch: start },
      { line: inTag.from.line, ch: start + selection.length }
    );
    return;
  }

  // 3. Selection already contains underline markup: remove it.
  if (selection.indexOf(OPEN) !== -1 && selection.indexOf(CLOSE) !== -1) {
    const unwrapped = selection.replace(UNWRAP_RE, '$1');
    if (unwrapped !== selection) {
      replaceKeepSelection(editor, unwrapped);
      return;
    }
  }

  // 4. Otherwise wrap, one line at a time (an inline tag must not span lines).
  const wrapped = selection.split('\n').map(wrapLine).join('\n');
  if (wrapped === selection) return;
  replaceKeepSelection(editor, wrapped);
}

module.exports = class UnderlinePlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'toggle-underline',
      name: 'Toggle underline',
      editorCallback: (editor) => toggle(editor),
      hotkeys: [{ modifiers: ['Mod'], key: 'U' }],
    });
  }
};