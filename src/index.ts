function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function measureText({ text, bold, fontFamily, fontSize }) {
  // get the CSS metrics.
  // NB: NO CSS lineHeight value !
  let div = document.createElement('DIV');
  div.id = '__textMeasure';
  div.innerHTML = text;
  div.style.position = 'absolute';
  div.style.top = '-500px';
  div.style.left = '0';
  div.style.fontFamily = fontFamily;
  div.style.fontWeight = bold ? 'bold' : 'normal';
  div.style.fontSize = fontSize + 'pt';
  div.style.lineHeight = '1em';
  document.body.appendChild(div);

  let cssSize = { width: div.offsetWidth, height: div.offsetHeight },
    cssInfo = window.getComputedStyle(div, null),
    fontSizePx = parseFloat(cssInfo['fontSize']);

  document.body.removeChild(div);

  // get the canvas metrics.
  let canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');

  context.font = fontSizePx + 'px ' + fontFamily;
  context.textAlign = 'left';
  context.fillStyle = 'blue';
  context.textBaseline = 'baseline';

  let metrics = context.measureText(text),
    lineGap =
      cssSize.height -
        (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) || 0,
    advMetrics = {
      width: metrics.width,
      cssHeight: cssSize.height,
      cssFontSizePx: fontSizePx,
      fontAscent: metrics.fontBoundingBoxAscent,
      fontDescent: metrics.fontBoundingBoxDescent,
      actualAscent: metrics.actualBoundingBoxAscent,
      actualDescent: metrics.actualBoundingBoxDescent,
      lineHeight: cssSize.height,
      lineGap: lineGap,
      lineGapTop: lineGap / 2,
      lineGapBottom: lineGap / 2,
    };

  return advMetrics;
}

export class Textika {
  canvas: HTMLCanvasElement;
  text = '';
  fontFamily = 'Arial';
  fontSize = 12;
  width = 300;
  height = 50;
  padding = 0;

  selection = {
    start: 0,
    length: 0,
  };

  _input = document.createElement('textarea');

  constructor({ canvas }) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousedown', (e) => {
      this._handleMouseDown(e);
    });
    this.canvas.parentElement.appendChild(this._input);
    this._input.addEventListener('input', (e) => {
      const { value } = this._input;
      this.set({
        text:
          this.text.slice(0, this.selection.start) +
          value +
          this.text.slice(this.selection.start),
        selection: {
          start: this.selection.start + 1,
          length: value.length,
        },
      });
      this._input.value = '';
    });
    this._input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.set({
          selection: {
            start: this.selection.start - 1,
            length: this.selection.length,
          },
        });
      }
      if (e.key === 'ArrowRight') {
        this.set({
          selection: {
            start: this.selection.start + 1,
            length: this.selection.length,
          },
        });
      }
      if (e.key === 'Backspace') {
        this.set({
          text:
            this.text.slice(0, this.selection.start - 1) +
            this.text.slice(this.selection.start + this.selection.length),
        });
        return;
      }
    });
  }
  _handleMouseDown(e) {
    e.preventDefault();
    this._input.focus();
  }
  set(attrs) {
    Object.assign(this, attrs);
    this.draw();
    setTimeout(() => {
      this.draw();
    }, 1000);
  }
  draw() {
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;

    const ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.translate(this.padding, this.padding);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'bottom';
    const metrics = measureText(this);
    const array = this._toPlainObject();
    let dx = 0;
    let dy = 0;
    array.forEach((item, index) => {
      ctx.font = `${item.fontWeight} ${item.fontSize} ${this.fontFamily}`;
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, dx, this.fontSize);

      dx += ctx.measureText(item.text).width;
    });

    const cursorX = ctx.measureText(
      this.text.slice(0, this.selection.start)
    ).width;
    ctx.fillRect(cursorX, 0, 2, this.fontSize);

    ctx.restore();
  }
  toHTML() {
    return `<div style="font-size: ${this.fontSize}px; font-family: ${this.fontFamily}; display: inline-block; line-height: 1em; padding: ${this.padding}px;">${this.text}</div>`;
  }
  _toTokenedLines() {
    const lines = [];
    const plainObjects = this._toPlainObject();
    let lastLine = {
      lineHeight: this.fontSize,
      tokens: [],
    };
    lines.push(lastLine);
    plainObjects.forEach((item) => {
      lastLine.tokens.push({
        text: item.text,
        fontWeight: item.fontWeight,
        color: item.color,
        fontSize: item.fontSize,
      });
    });
    return lines;
  }
  _toPlainObject() {
    const node = htmlToElement(this.toHTML());
    document.body.appendChild(node);
    const array = [];
    node.childNodes.forEach((child) => {
      let styles = {};
      if (child.nodeType !== 3) {
        styles = window.getComputedStyle(child, null);
      }

      array.push({
        text: child.textContent,
        fontWeight: styles['font-weight'] || 'normal',
        color: styles['color'] || 'black',
        fontSize: styles['font-size'] || this.fontSize + 'px',
      });
    });
    document.body.removeChild(node);
    return array;
  }
  createCompareNode() {
    const brother = htmlToElement(this.toHTML());
    brother.style.position = 'absolute';
    brother.style.top = '0';
    brother.style.left = '0';
    brother.style.color = 'red';
    brother.style.zIndex = '-1';
    this.canvas.parentElement.appendChild(brother);
  }
}
