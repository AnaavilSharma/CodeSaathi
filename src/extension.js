const vscode = require('vscode');
const { convertCode } = require('./codeConverter');
const { runCode } = require('./codeRunner');
const { deleteFile } = require('./fileManager');

function activate(context) {
  let disposable = vscode.commands.registerCommand('codesaathi.convertCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.window.showErrorMessage('Open a file first!');

    const originalFilePath = editor.document.fileName;
    const code = editor.document.getText();

    const targetLang = await vscode.window.showInputBox({ prompt: 'Enter target language (e.g., python, java, cpp)' });
    if (!targetLang) return;

    try {
      const convertedCode = await convertCode(code, targetLang);
      const output = await runCode(convertedCode, targetLang);

      const doc = await vscode.workspace.openTextDocument({ content: convertedCode, language: targetLang });
      await vscode.window.showTextDocument(doc);

      vscode.window.showInformationMessage('Code converted and executed successfully!');

      // Prompt to delete original file
      const deleteConfirm = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Do you want to delete the original file?'
      });

      if (deleteConfirm === 'Yes') {
        deleteFile(originalFilePath);
        vscode.window.showInformationMessage('Original file deleted.');
      }

    } catch (err) {
      vscode.window.showErrorMessage(err.message);
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };