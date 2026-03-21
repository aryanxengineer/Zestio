import DataUriParser from "datauri";
import path from "node:path";

const getBuffer = (file: Buffer | any) => {
  const parser = new DataUriParser();

  const extName = path.extname(file.originalname).toString()

  return parser.format(extName, file.buffer);

};
