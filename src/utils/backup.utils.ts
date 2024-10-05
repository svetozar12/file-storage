import cron from "node-cron";
import path from "path";
import { uploadDir } from "./multer.utils";
import fs from "fs";
import archiver from "archiver";
import simpleGit from "simple-git";
import { envs } from "..";

const backupFolder = path.join(__dirname, "backupRepo");
const archivesFolder = path.join(backupFolder, "archives");
const repoUrl = `https://${envs.GITHUB_TOKEN}@github.com/svetozar12/file-storage.git`;

const pushToGit = async (filePath: string) => {
  try {
    // Ensure the backupFolder exists
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }

    const git = simpleGit(backupFolder);

    // Clone the repository if the .git folder doesn't exist
    if (!fs.existsSync(path.join(backupFolder, ".git"))) {
      console.log("Cloning the Git repository into backupFolder...");
      await git.clone(repoUrl, backupFolder);
    } else {
      console.log("Pulling latest changes from the remote repository...");
      await git.pull("origin", "main");
    }

    // Set user configuration after cloning the repository
    await git.addConfig("user.name", "svetozar12");
    await git.addConfig("user.email", "svetozar12@users.noreply.github.com");

    // Ensure the archives folder exists inside the repository
    if (!fs.existsSync(archivesFolder)) {
      fs.mkdirSync(archivesFolder, { recursive: true });
    }

    // Copy the file to the archives folder
    const fileName = path.basename(filePath);
    const destination = path.join(archivesFolder, fileName);
    fs.copyFileSync(filePath, destination);

    // Navigate to the backupFolder
    git.cwd(backupFolder);

    // Add and commit only the new archive file
    await git.add(path.relative(backupFolder, destination));
    const commitMessage = `Backup created: ${new Date().toISOString()}`;
    await git.commit(commitMessage);

    // Push to remote
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
  const outputFilePath = path.join(__dirname, `archive_${timestamp}.zip`);

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

// Schedule the cron job to run every minute
cron.schedule("0 0 * * *", () => {
  if (!envs.GITHUB_TOKEN && envs.NODE_ENV !== "production")
    console.log("BACKUP IS DISABLED");
  console.log("Running cron job to create archive...");
  createArchive();
});
