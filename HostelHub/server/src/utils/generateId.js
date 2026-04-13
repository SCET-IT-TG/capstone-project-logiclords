// utils/generateId.js

export const generateId = async (Model, prefix) => {
  const year = new Date().getFullYear();

  const count = await Model.countDocuments();

  const sequence = String(count + 1).padStart(3, "0");

  return `${prefix}${year}${sequence}`;
};