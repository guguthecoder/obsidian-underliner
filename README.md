# Underliner

**`Ctrl+U` to underline. Press it again to take the underline away.**

[![Latest release](https://img.shields.io/github/v/release/guguthecoder/obsidian-underliner?style=flat-square&color=7856ff)](https://github.com/guguthecoder/obsidian-underliner/releases)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Size](https://img.shields.io/badge/plugin-4.5%20KB-lightgrey?style=flat-square)](#design-notes)

Obsidian gives bold and italic a hotkey but not underline, because Markdown has no underline syntax. The only way is raw HTML:

```
This sentence has one <u>underlined</u> phrase in it.
```

Seven characters typed around every phrase, closed every time, forgotten often enough to be irritating. Underliner turns that into a single keystroke, and a toggle.

## What it does

| You do | You get |
| --- | --- |
| Select `important` and press <kbd>Ctrl</kbd>+<kbd>U</kbd> | `<u>important</u>` |
| Press it again | `important` |
| Select text that is already inside `<u>` … `</u>` | the tags are removed, no nesting |
| Put the cursor inside an empty `<u>…</u>` pair and press | the pair is removed |
| Put the cursor inside a word, nothing selected | that word is wrapped (press again to unwrap) |
| Press with the cursor on blank space | `<u></u>`, cursor between the tags |
| Select several paragraphs | each line wrapped on its own |

## Why this isn't a five-line snippet

Because the naive version breaks on real notes.

- **An inline HTML tag cannot span a line break.** Wrapping a multi-line selection in one `<u>…</u>` silently breaks the rendering of the paragraph around it. Underliner wraps each line separately and leaves leading whitespace outside the tag, so it keeps working inside list items and blockquotes.
- **Pressing the hotkey twice should be a no-op.** Underliner detects a surrounding pair — or any `<u>` pair contained in the selection — and removes it instead of nesting another one.
- **Nothing selected shouldn't do nothing.** With the cursor inside a word, that word is wrapped — no need to select it first. On blank space it inserts an empty pair and drops the cursor between the tags.

Word detection covers ASCII words (letters, digits, `_`, `-`, `'`). It deliberately skips CJK text: Chinese and Japanese have no spaces, so guessing a word boundary there would wrap the wrong range — you get an empty pair to type into instead.

## Install

### Community directory

Submitted and under review. Once it's listed, install it from **Settings → Community plugins → Browse**.

### BRAT (before that)

1. Install and enable [BRAT](https://github.com/TfTHacker/obsidian42-brat).
2. Run the command **BRAT: Add a beta plugin for testing**.
3. Enter `guguthecoder/obsidian-underliner`.

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/guguthecoder/obsidian-underliner/releases/latest).
2. Put them in `<vault>/.obsidian/plugins/underliner/`.
3. Reload Obsidian, then enable **Underliner** in Settings → Community plugins.

### Hotkey

<kbd>Ctrl</kbd>+<kbd>U</kbd> (<kbd>⌘</kbd>+<kbd>U</kbd> on macOS) is bound as a default, so it works the moment the plugin is enabled. If something else claims it, rebind it in Settings → Hotkeys → **Underliner: Toggle underline**. On mobile, add the command to the editor toolbar in **Settings → Mobile**.

## Already using another underline plugin?

There are older plugins that write `<u>` too. If one of them does everything you need, keep it — this isn't meant to replace something that already works.

It exists for the cases those ones get wrong, and which are still open issues in their trackers: the underline doesn't come off when you press the hotkey again, the toggle toggles something unexpected, a multi-line selection renders broken, the cursor inside a word does nothing, or a word at the end of a line is skipped.

## Compatibility

- Obsidian 1.4.0 and later, desktop and mobile.
- Source mode, Live Preview and Reading view.
- Only edits text when you run the command — the selection, or the word under the cursor. Notes are never modified on load.
- Uninstalling leaves the `<u>` tags in your notes, as it should: they're ordinary text, and Obsidian renders them without any plugin.

## Design notes

The plugin is a single 4.5 KB `main.js` with no dependencies, no settings tab, no stylesheet and no build step — open it, edit it, reload Obsidian. Underlining is native HTML, so the rendering is already there; there is nothing to style.

Underliner deliberately does not add a toolbar button, a formatting menu entry, a live-preview decorator, or tags like `<center>` / `<sub>` / `<sup>`. Those are the features that turn five kilobytes into five thousand lines.

## License

[MIT](LICENSE)