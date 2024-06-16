import * as path from "path";
import * as vscode from "vscode";
import {
  CUSTOM_COMMIT_MESSAGE_PREFIX,
  commitMessagePrefixOptions,
} from "../constants";

export async function promptCommitMessage(
  document: vscode.TextDocument
): Promise<string | undefined> {
  const commitMessagePrefix =
    await promptCommitMessagePrefix();

  const commitMessage =
    await vscode.window.showInputBox({
      placeHolder: `adjust ${path.basename(
        document.uri.fsPath
      )}`,
      prompt:
        "Enter the commit message for this file.",
    });
  if (!commitMessage) {
    vscode.window.showInformationMessage(
      "No commit message entered."
    );
    return;
  }

  return `${commitMessagePrefix}: ${commitMessage}`;
}

export async function promptCommitMessagePrefix(): Promise<
  string | undefined
> {
  const commitMessagePrefix =
    await vscode.window.showQuickPick(
      commitMessagePrefixOptions
    );

  if (
    commitMessagePrefix ===
    CUSTOM_COMMIT_MESSAGE_PREFIX
  ) {
    const customCommitMessagePrefix =
      await vscode.window.showInputBox({
        placeHolder:
          "Enter custom commit message prefix",
        prompt:
          "Enter the custom commit message prefix.",
      });

    if (!customCommitMessagePrefix) {
      vscode.window.showInformationMessage(
        "No custom commit message prefix entered."
      );
      return;
    } else {
      commitMessagePrefixOptions.unshift(
        customCommitMessagePrefix
      );
    }
    return customCommitMessagePrefix;
  }

  if (!commitMessagePrefix) {
    vscode.window.showInformationMessage(
      "No commit message prefix selected."
    );
    return;
  }

  return commitMessagePrefix;
}
