const fs = require("fs"),
  tsvert = require("tsvert");

// tsvファイルを読み込み
let tsv = fs.readFileSync("metadata.tsv", "utf8");

// 特殊文字をエスケープ
tsv = tsv.replaceAll('"', '\\"');

tsvert.setOptions({
  indent: false,
});
// tsvをjsonの配列形式の文字列に変換
let metadataListStr = tsvert(tsv, "json");
// 配列の[]を削除
metadataListStr = metadataListStr.replace("[", "").replace("];", "");
// json形式の文字列をスプリット
const metadataList = metadataListStr.split(",\n");

// 一件ずつファイル出力
let count = 1;
const notAttributes = [
  "image",
  "animation_url",
  "external_url",
  "name",
  "description",
  "attributes",
];
metadataList.forEach((metadata) => {
  const path = "./metadata/" + count + ".json";
  let json = JSON.parse(metadata);

  json.attributes = [];

  Object.keys(json).forEach((key) => {
    // valueが空なら削除
    if (json[key] == "" || json[key] == "undefined") {
      delete json[key];
      return;
    }

    // image,animation_url,external_url,name,description以外ならattributesに入れ込む
    if (!notAttributes.includes(key)) {
      json["attributes"].push({
        trait_type: key,
        value: json[key],
      });
      delete json[key];
    }
  });
  fs.writeFile(path, JSON.stringify(json), (err) => {
    if (err) console.log(err);
  });
  count++;
});
