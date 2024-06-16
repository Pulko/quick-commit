import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import { promptCommitMessage } from "../utils/prompt";
import { commitMessagePrefixOptions } from "../constants";
import { getValidatedEnvironment } from "../utils/validate";

suite("Extension Test Suite", function () {
  let inputBoxStub: sinon.SinonStub;
  let quickPickStub: sinon.SinonStub;
  let saveFileStub: sinon.SinonStub;

  suiteSetup(async () => {
    const extensionId = "quick-commit";
    const allExtensions = vscode.extensions.all;

    const found = allExtensions.filter((ext) => {
      return ext.id.includes("quick-commit");
    });

    if (!found.length) {
      throw new Error(
        `Extension ${extensionId} not found in the context.`
      );
    }
    await found[0].activate();

    const workspaceFolders =
      vscode.workspace.workspaceFolders;
    if (
      workspaceFolders &&
      workspaceFolders.length > 0
    ) {
      const workspacePath =
        workspaceFolders[0].uri.fsPath;
      const exec = require("child_process").exec;
      await new Promise<void>(
        (resolve, reject) => {
          exec(
            "git init",
            { cwd: workspacePath },
            (error: any) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        }
      );
    }

    inputBoxStub = sinon
      .stub(vscode.window, "showInputBox")
      .resolves("Test commit message");

    saveFileStub = sinon
      .stub(vscode.window, "showSaveDialog")
      .resolves(vscode.Uri.file("test.txt"));

    quickPickStub = sinon
      .stub(vscode.window, "showQuickPick")
      .returns(
        Promise.resolve<
          vscode.QuickPickItem | undefined
        >({
          label: commitMessagePrefixOptions[0],
          description:
            commitMessagePrefixOptions[0],
        })
      );
  });

  suiteTeardown(async () => {
    inputBoxStub.restore();
    quickPickStub.restore();
    saveFileStub.restore();
    await vscode.commands.executeCommand(
      "workbench.action.closeAllEditors"
    );
  });

  test("Test if command is registered", async () => {
    const commands =
      await vscode.commands.getCommands(true);
    console.log({ commands });
    assert.ok(
      commands.includes(
        "quick-commit.commitFile"
      ),
      "Command is not registered"
    );
  });

  test("Test command execution with empty editor", async () => {
    const didExecute =
      await vscode.commands.executeCommand(
        "quick-commit.commitFile"
      );

    console.log({ didExecute });
    assert.ok(
      didExecute === undefined,
      "Command did not execute successfully"
    );
  });

  test("Test command execution with unsaved editor", async () => {
    const doc =
      await vscode.workspace.openTextDocument({
        content: "Hello World",
      });
    const editor =
      await vscode.window.showTextDocument(doc);

    const didExecute =
      await vscode.commands.executeCommand(
        "quick-commit.commitFile"
      );
    assert.ok(
      didExecute === undefined,
      "Command did not execute successfully"
    );

    await vscode.commands.executeCommand(
      "workbench.action.revertAndCloseActiveEditor"
    );

    await vscode.commands.executeCommand(
      "workbench.action.closeAllEditors"
    );
  });

  test("Test promptCommitMessage function", async () => {
    const doc =
      await vscode.workspace.openTextDocument({
        content: "Hello World",
      });
    const message = await promptCommitMessage(
      doc
    );
    assert.ok(
      message?.includes("Test commit message"),
      "promptCommitMessage did not return the expected string"
    );

    await vscode.commands.executeCommand(
      "workbench.action.revertAndCloseActiveEditor"
    );
  });

  test("Test commitMessagePrefixOptions constant", () => {
    assert.ok(
      Array.isArray(commitMessagePrefixOptions),
      "commitMessagePrefixOptions is not an array"
    );
    assert.ok(
      commitMessagePrefixOptions.length > 0,
      "commitMessagePrefixOptions array is empty"
    );
  });

  test("Test getValidatedEnvironment function", () => {
    const env = getValidatedEnvironment();
    assert.strictEqual(
      typeof env,
      "object",
      "getValidatedEnvironment did not return an object"
    );
    assert.ok(
      env !== null,
      "getValidatedEnvironment returned null"
    );
  });
});
