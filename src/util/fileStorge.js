import fs from "fs/promises";

export const storeData = async (filename, data) => {
  try {
    await fs.writeFile(`localData/${filename}`, JSON.stringify(data));
  } catch (error) {
    console.log(`File Save Error :: ${error}`);
  }
};

export const getStoreData = async (filename) => {
  try {
    const fileContent = await fs.readFile(`localData/${filename}`, {
      encoding: "utf-8",
    });
    const data = JSON.parse(fileContent);
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
