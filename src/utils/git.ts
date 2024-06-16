import * as cp from "child_process";

export async function isGitRepository(
  folderPath: string
): Promise<boolean> {
  return new Promise((resolve) => {
    cp.exec(
      "git rev-parse --is-inside-work-tree",
      { cwd: folderPath },
      (error) => {
        resolve(!error);
      }
    );
  });
}

export async function gitHasChanges(
  folderPath: string
): Promise<boolean> {
  return new Promise((resolve) => {
    cp.exec(
      "git status --porcelain -- " + folderPath,
      { cwd: folderPath },
      (error, stdout) => {
        resolve(stdout !== "");
      }
    );
  });
}

export async function gitAddFile(
  folderPath: string,
  filePath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(
      `git add ${filePath}`,
      { cwd: folderPath },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(folderPath);
      }
    );
  });
}

export async function gitCommit(
  folderPath: string,
  commitMessage: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(
      `git commit -m "${commitMessage}"`,
      { cwd: folderPath },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(commitMessage);
      }
    );
  });
}
