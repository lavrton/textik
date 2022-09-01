# Textik

2d canvas-based Rich Text Editor.

`Textik` is a fork of [Carota](https://github.com/danielearwicker/carota).

# Scripts

```bash
# testing
npm start
```

# Motivation

There a lot of rich-text editors. All of them DOM based with `contentEditable` flow.
But I need a tool to display rich text inside canvas.

It is possible to do some workarounds with `html2canvas` tool. (1) Convert DOM (rich text) into image and (2) then display it on canvas. But that aproach is slow and not very consistent.

So we will have to make a new solution. If possible it should use canvas API only to do rendering.

Even Google Docs is looking into that direction: https://workspaceupdates.googleblog.com/2021/05/Google-Docs-Canvas-Based-Rendering-Update.html

# Goals

- Full Rich Text editor. Many styles, different colors, font sizes, etc for any part of the text.
- Full desktop and mobile support
- Undo, redo, selection, all commont hotkeys. Replicate all editing functions on canvas. Damn, are we sure we are ready for this?
- Make rendering as close as possible to native DOM approach. Ideally, if we import HTML string into `textik`, it should look 100% the same as that string in the DOM.
- Make API simple to integrate into canvas libraries. First target is `konva`.
- No CSS/DOM measurements. If possible, use only canvas API.

## TODO:

- [ ] Add support for word-wrapping. Similar to `konva` it should wrap long word if width is limited
- [ ] Add API to read full position of every word/caracter.
- [ ] Export into HTML string, import from HTML string
- [ ] Full typescirpt
- [ ] Support for lists
- [ ] Copy all word wrapping properties from `konva`
