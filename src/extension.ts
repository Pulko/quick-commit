import * as vscode from "vscode";
import { promptCommitMessage } from "./utils/prompt";
import { getValidatedEnvironment } from "./utils/validate";
import {
  gitAddFile,
  gitCommit,
} from "./utils/git";

export function activate(
  context: vscode.ExtensionContext
) {
  const commitFile =
    vscode.commands.registerCommand(
      "quick-commit.commitFile",
      async () => {
        const validatedEnv =
          await getValidatedEnvironment();

        if (!validatedEnv) {
          return;
        }

        const commitMessage =
          await promptCommitMessage(
            validatedEnv.document
          );

        if (!commitMessage) {
          return;
        }

        await gitAddFile(
          validatedEnv.currentPathFolder,
          validatedEnv.document.uri.fsPath
        )
          .then((folderPath) =>
            gitCommit(folderPath, commitMessage)
          )
          .then((commitMessage) =>
            vscode.window.showInformationMessage(
              "Commited: " + commitMessage
            )
          )
          .catch((error) => {
            vscode.window.showErrorMessage(
              "An error occurred: " +
                error.message
            );
          });
      }
    );

  context.subscriptions.push(commitFile);
}

export function deactivate() {}
