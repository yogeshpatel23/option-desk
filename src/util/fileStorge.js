import fs from "fs/promises";

export const storeData = async (filename, data) => {
  try {
    await fs.writeFile(`localData/${filename}`, JSON.stringify(data));
  } catch (error) {
    console.log(`File Save Error :: ${error}`);
  }
};

export const getStoreData = async (filename) => {
  const fileContent = await fs.readFile(`localData/${filename}`, {
    encoding: "utf-8",
  });
  const data = JSON.parse(fileContent);
  return data;
};
