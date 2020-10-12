import Konva from "konva";

export const xPad = 10;
export const yPad = 10;
export const gapWidth = 5;
export const fontFamily = "Ubuntu Mono, Courier";
export const defaultFontSize = 24;
const oText = new Konva.Text({
  text: "o",
  fontFamily: fontFamily,
  fontSize: defaultFontSize,
});
export const textHeight = oText.fontSize();
export const holeWidth = oText.getTextWidth();
export const targetRange = textHeight;

export function computePiecesWidths(pieces, fontSize = defaultFontSize) {
  return pieces.map(p => {
    if (p == null) {
      const holeText = new Konva.Text({
        text: "o",
        fontFamily: fontFamily,
        fontSize: fontSize,
      });
      return holeText.getTextWidth();
    } else {
      const text = new Konva.Text({
        text: p,
        fontFamily: fontFamily,
        fontSize: fontSize,
      });
      return text.getTextWidth();
    }
  });
}

export function computePiecesPositions(pieces, fontSize) {
  const widths = computePiecesWidths(pieces, fontSize);
  let pieceX = 0;
  const xes = widths.map(w => {
    let myX = pieceX;
    pieceX += w + gapWidth;
    return myX;
  });
  return xes;
}

export function computeNodeWidth(pieces, fontSize) {
  const widths = computePiecesWidths(pieces, fontSize);
  let width = gapWidth * (pieces.length - 1);
  for (const w of widths) {
    width += w;
  }
  return width;
}
