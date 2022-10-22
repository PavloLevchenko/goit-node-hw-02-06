const { readFile, writeFile } = require("fs/promises");

const fromJson = (data) => {
  return JSON.parse(data);
};

const toJson = (jsonString) => {
  return JSON.stringify(jsonString, 2, 2);
};

const read = async (path) => {
  try {
    const contacts = await readFile(path);
    return fromJson(contacts);
  } catch (err) {
    console.error(err);
  }
};

const write = async (path, data) => {
  try {
    const jsonString = toJson(data);
    await writeFile(path, jsonString);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  read,
  write,
};
