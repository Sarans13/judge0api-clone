const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  console.log(filepath);
  console.log(jobId);
  console.log(outPath);
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o "${outPath}"`,
      { cwd: outputPath },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Compilation failed with error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Compilation failed with error: ${stderr}`);
          reject(new Error(stderr));
          return;
        }
        console.log('Compilation successful');

        exec(`"${outPath}"`, { cwd: outputPath }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Execution failed with error: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`Execution failed with error: ${stderr}`);
            reject(new Error(stderr));
            return;
          }
          console.log('Execution successful');
          resolve(stdout); // Resolve the stdout value
        });
      }
    ); 
  });
};

module.exports = {
  executeCpp,
};
