// Convert a DataView to a string
function viewToString(view, offset, length) {
  let res = '';
  for (let i = 0; i < length; i += 1) {
    res += String.fromCharCode(view.getUint8(offset + i));
  }
  return res;
}

// Pack a number treated as unsigned 32 bits in string (big-endian)
const numberToUInt32 = (n) => {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, n);
  return viewToString(view, 0, 4);
};

// Extract a tEXT chunk from a PNG file and retrieve expressiontutor's metadata
export function getExpressionTutorMetaData(arraybuffer) {
  const view = new DataView(arraybuffer);
  let offset = 8;
  while (offset < view.byteLength) {
    const chunkLength = view.getUint32(offset);
    const key = 'expressiontutor';
    if (viewToString(view, offset + 4, 4 + key.length) === `tEXt${key}`) {
      return viewToString(view, offset + 4 + 4 + key.length + 1, chunkLength - key.length - 1);
    }
    offset += chunkLength + 12; // skip 4 bytes of length, 4 of chunktype, 4 of CRC
  }
  return undefined;
}

// Encode in a tEXt chunk of a PNG file a metadata with key "expressiontutor"
export function addExpressionTutorMetaData(b64png, metadataValue) {
  const PNGString = atob(b64png.replace(/^data:image\/png;base64,/, ''));

  // Prepare tEXt chunk to insert
  const chunkType = 'tEXt';
  const chunkData = `expressiontutor\0${metadataValue}`;
  const chunkCRC = numberToUInt32(0); // dummy CRC
  const chunkDataLen = numberToUInt32(chunkData.length);
  const chunk = chunkDataLen + chunkType + chunkData + chunkCRC;

  // Compute header (IHDR) length
  const headerLengthArray = new Uint8Array(4);
  for (let i = 0; i < 4; i += 1) {
    headerLengthArray[i] = PNGString.charCodeAt(8 + i);
  }
  const headerDataLen = new DataView(headerLengthArray.buffer).getUint32();
  const headerLen = 8 + 4 + 4 + headerDataLen + 4;

  // Assemble new PNG
  const modifiedPNGString = PNGString.substring(0, headerLen)
                            + chunk + PNGString.substring(headerLen);
  return `data:image/png;base64,${btoa(modifiedPNGString)}`;
}
