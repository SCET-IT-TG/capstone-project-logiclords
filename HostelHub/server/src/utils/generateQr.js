// utils/generateQr.js

import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export const generateQrBase64 = async (data) => {
  return await QRCode.toDataURL(data);
};

export const generateQrImage = async (data, filename) => {
  const folderPath = "uploads/qr";

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, `${filename}.png`);

  await QRCode.toFile(filePath, data);

  return filePath;
};