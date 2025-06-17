const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Reactのbuildディレクトリを静的ファイルとして提供
app.use(express.static(path.join(__dirname, "build")));

// その他のルートはindex.htmlを返す（SPA対応）
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
