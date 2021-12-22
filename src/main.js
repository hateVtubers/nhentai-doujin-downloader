import fs from "fs";
import path from "path";
import axios from "axios";
import { SingleBar, Presets } from "cli-progress";
import { API } from "nhentai";
import config from "./config.js";

const Api = new API();
const bar = new SingleBar({}, Presets.shades_classic);
const arg = process.argv[2].replace("#", "");
const { pages } = await Api.fetchDoujin(arg);

const downloadDoujin = async (dirName, name, url) => {
  fs.mkdirSync(path.join(config.__dirname, `${config.path}/${dirName}`), {
    recursive: true,
  });
  const pathDir = path.resolve(config.__dirname, `${config.path}/${dirName}`, name);
  const writer = fs.createWriteStream(pathDir);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

bar.start(pages.length, 0);
pages.forEach(({ url, extension }, i) => {
  downloadDoujin(arg, `${i}.${extension}`, url);
  bar.update(i + 1);
});
bar.stop();
