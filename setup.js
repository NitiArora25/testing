const fs = require("fs");
const folders = [
  "src/components",
  "src/pages",
  "src/hooks",
  "src/utils",
  "src/styles",
  "src/types",
  "src/services",
  "src/contexts",
  "src/assets",
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

console.log("Project structure created!");
