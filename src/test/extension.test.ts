import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as myExtension from "../extension";
import {
  promptCommitMessage,
  promptCommitMessagePrefix,
} from "../utils/prompt";
import { commitMessagePrefixOptions } from "../constants";
import { getValidatedEnvironment } from "../utils/validate";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage(
    "Start all tests."
  );

  test.only("Test if command is registered", async () => {
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
});
