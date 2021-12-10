import { SingleBar, Presets } from "cli-progress";
import { API } from "nhentai";
import imageDownload from "image-downloader";

class Nhentai {
  constructor(code, path) {
    this.code = code;
    this.path = path;
    this.api = new API();
  }

  existsDoujin() {
    return this.api.doujinExists(this.code);
  }

  downloadDoujin = (url, path) => {
    const option = {
      url,
      dest: path,
    };
    imageDownload
      .image(option)
      .then(({ filename }) => {})
      .catch((err) => {});
  };
}

const nhentai = new Nhentai(process.argv[2], "./build/");

if (await nhentai.existsDoujin()) {
  const { titles, pages } = await nhentai.api.fetchDoujin(nhentai.code);
  const progressBar = new SingleBar({}, Presets.legacy);
  import("fs/promises").then((fs) => {
    fs.mkdir(`${nhentai.path}${titles.english}`);
  });

  console.log(`Downloading at ${nhentai.path}${titles.english}...`);
  progressBar.start(pages.length, 0);
  pages.forEach((page, index) => {
    nhentai.downloadDoujin(page.url, `${nhentai.path}${titles.english}/`);
    progressBar.update(index + 1);
  });
  progressBar.stop();
} else {
  console.log(`please intent a valid doujin code (>.<)
example: "node main 177013"`);
}
