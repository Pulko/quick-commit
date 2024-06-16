import * as vscode from "vscode";
import {
  gitHasChanges,
  isGitRepository,
} from "./git";

export async function getValidatedEnvironment(): Promise<
  | {
      document: vscode.TextDocument;
      workspaceFolder: vscode.WorkspaceFolder;
      currentPathFolder: string;
    }
  | undefined
> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage(
      "No active editor found."
    );
    return;
  }

  if (
    editor.document.isUntitled ||
    editor.document.isDirty
  ) {
    vscode.window.showInformationMessage(
      "Please save the file before committing."
    );
    return;
  }

  const document = editor.document;
  const workspaceFolder =
    vscode.workspace.getWorkspaceFolder(
      document.uri
    );

  if (!workspaceFolder) {
    vscode.window.showInformationMessage(
      "Please open a workspace folder."
    );
    return;
  }

  const currentPathFolder =
    editor.document.uri.fsPath.includes("/")
      ? editor.document.uri.fsPath.substring(
          0,
          editor.document.uri.fsPath.lastIndexOf(
            "/"
          )
        )
      : editor.document.uri.fsPath;

  const isGitRepo = await isGitRepository(
    currentPathFolder
  );

  if (!isGitRepo) {
    vscode.window.showInformationMessage(
      "This is not a git repository."
    );
    return;
  }

  const hasChanges = await gitHasChanges(
    currentPathFolder
  );

  if (!hasChanges) {
    vscode.window.showInformationMessage(
      "There are no changes in this file."
    );
    return;
  }

  return {
    document,
    currentPathFolder,
    workspaceFolder,
  };
}
