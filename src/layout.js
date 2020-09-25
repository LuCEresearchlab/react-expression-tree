import Konva from "konva";

export const xPad = 10;
export const yPad = 10;
export const gapWidth = 5;
export const fontFamily = "Ubuntu Mono, Courier";
export const fontSize = 24;
const oText = new Konva.Text({
  text: "o",
  fontFamily: fontFamily,
  fontSize: fontSize,
});
export const textHeight = oText.fontSize();
export const holeWidth = oText.getTextWidth();
export const targetRange = textHeight;

function computePiecesWidths(pieces) {
  return pieces.map(p => {
    if (p == null) {
      return holeWidth;
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

export function computePiecesPositions(pieces) {
  const widths = computePiecesWidths(pieces);
  let pieceX = 0;
  const xes = widths.map(w => {
    let myX = pieceX;
    pieceX += w + gapWidth;
    return myX;
  });
  return xes;
}

export function computeNodeWidth(pieces) {
  const widths = computePiecesWidths(pieces);
  let width = gapWidth * (pieces.length - 1);
  for (const w of widths) {
    width += w;
  }
  return width;
}
