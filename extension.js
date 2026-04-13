// GitHub Repos - VS Code extension
const vscode = require('vscode');
const ReposView = require('./reposView');
const { showWebview } = require('./webview');

function activate(context) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('githubRepos', new ReposView(context.extensionUri))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('github-repos.open', () => showWebview(context.extensionUri))
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
