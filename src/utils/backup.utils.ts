import cron from "node-cron";
import path from "path";
import { uploadDir } from "./multer.utils";
import fs from "fs";
import archiver from "archiver";
import simpleGit from "simple-git";
import { envs } from "..";

const backupFolder = path.join(`archives`);
const repoUrl = `https://${envs.GITHUB_TOKEN}@github.com/svetozar12/e-com.git`;
const pushToGit = async (filePath: string) => {
  const git = simpleGit(backupFolder);
  try {
    // Check if git repository is initialized
    if (!fs.existsSync(path.join(backupFolder, ".git"))) {
      console.log("Initializing new Git repository...");
      await git.init();
      await git.addRemote("origin", repoUrl);
    }

    // Add, commit, and push the new file
    await git.add(filePath);
    await git.commit(`Backup created: ${new Date().toISOString()}`);
    await git.push("origin", "main");
    console.log("Backup pushed to GitHub successfully.");
  } catch (err) {
    console.error("Error pushing backup to GitHub:", err);
  }
};

// Function to create an archive of the folder
const createArchive = () => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const outputFilePath = path.join(`archive_${timestamp}.zip`);

  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level
  });

  output.on("close", async () => {
    console.log(
      `Archive created successfully: ${outputFilePath} (${archive.pointer()} total bytes)`,
    );
    await pushToGit(outputFilePath);
  });

  archive.on("error", (err) => {
    console.error("Error while creating archive:", err);
  });

  // Pipe the archive data to the output file
  archive.pipe(output);

  // Append files from the folder to the archive
  archive.directory(uploadDir, false);

  // Finalize the archive (meaning we have finished adding everything)
  archive.finalize();
};

// Schedule the cron job to run every hour
cron.schedule("0 0 * * *", () => {
  if (!envs.GITHUB_TOKEN) {
    return;
  }
  console.log("Running cron job to create archive...");
  createArchive();
});
