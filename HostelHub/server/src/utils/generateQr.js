import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export const generateQrImage = async (text, filename) => {

  const dir = path.join("uploads", "qrcodes");

  // create folder if not exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${filename}.png`);

  await QRCode.toFile(filePath, text);

  return filePath; // saves in DB
};