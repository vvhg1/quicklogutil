const vscode = require("vscode");

const insertText = (val) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage(
      "Can't insert log because no document is open"
    );
    return;
  }

  const selection = editor.selection;

  const range = new vscode.Range(selection.start, selection.end);

  editor.edit((editBuilder) => {
    editBuilder.replace(range, val);
  });
};

function getAllLogStatements(language, document, documentText) {
  let logToInsert = ``;
  let logStatements = [];
  switch (language) {
    case "csharp":
      if (checkUnity(documentText)) {
        logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.unityLogString");
      } else {
        logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.csharpLogString");
      }
      break;
    case "python":
      logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.pythonLogString");
      break;
    case "shellscript":
      logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.shellscriptLogString");
      break;
    case "javascript":
    case "typescript":
      logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.javascriptLogString");
      break;
    case "cpp":
      logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.cppLogString");
      break;
    case "c":
      logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.cLogString");
    default:
      return logStatements;
  }

  let logRegex;

  if (logToInsert === "") {
    switch (language) {
      case "csharp":
        if (checkUnity(documentText)) {
          logRegex =
            /Debug.Log\((.*)\);?/g;
        } else {
          logRegex =
            /Console.WriteLine\((.*)\);?/g;
        }
        break;

      case "python":
        logRegex =
          /Print\((.*)\)?/g;
        break;

      case "shellscript":
        logRegex =
          /echo\((.*)\)?/g;
        break;

      case "javascript":
      case "typescript":
        logRegex = /console.log\((.*)\);?/g;
        break;
      case "cpp":
        logRegex = /std::cout << (.*) << std::endl;?/g;
        break;
      case "c":
        logRegex = /printf\((.*)\);?/g;

      default:
        return logStatements;
    }
  } else {

    logRegex = logToInsert.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); //escape special characters
    logRegex = logRegex.replace(/\\{var\\}/g, "(.*)");
    logRegex = new RegExp(logRegex, 'g');
  }
  let match;
  while ((match = logRegex.exec(documentText))) {
    let matchRange = new vscode.Range(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length)
    );
    if (!matchRange.isEmpty) logStatements.push(matchRange);
  }
  return logStatements;
}
function checkUnity(documentText) {
  const unityRegex =
    /using UnityEngine;?/g;
  return unityRegex.test(documentText);
}

function deleteFoundLogStatements(workspaceEdit, docUri, logs) {
  logs.forEach((log) => {
    workspaceEdit.delete(docUri, log);
  });

  vscode.workspace.applyEdit(workspaceEdit).then(() => {
    logs.length > 1
      ? vscode.window.showInformationMessage(
        `${logs.length} logs deleted`
      )
      : vscode.window.showInformationMessage(
        `${logs.length} log deleted`
      );
  });
}

function activate(context) {
  let logger = vscode.window.createOutputChannel("Quick Log Util");
  logger.appendLine("quick-log-util is now active");
  console.log("quick-log-util is now active");

  const insertLogStatement = vscode.commands.registerCommand(
    "extension.insertLogStatement",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      let selection = editor.selection;
      const language = editor.document.languageId;
      let text = editor.document.getText(selection);
      if (!text) {
        let cursorPos = selection.start;
        let wordRange = editor.document.getWordRangeAtPosition(cursorPos);
        let wordBelowCursor = editor.document.getText(wordRange);
        text = wordBelowCursor;
      }
      let logToInsert = ``;
      switch (language) {
        case "csharp":
          const documentText = editor.document.getText();
          if (checkUnity(documentText)) {
            if (vscode.workspace.getConfiguration().get("quickLogUtil.unityLogString") === "") {
              logToInsert = `Debug.Log($"${text}: \{${text}\}");`;
            } else {
              logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.unityLogString");
            }
          } else {
            if (vscode.workspace.getConfiguration().get("quickLogUtil.csharpLogString") === "") {
              logToInsert = `Console.WriteLine($"${text}: \{${text}\}");`;
            } else {
              logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.csharpLogString");
            }
          }
          break;

        case "python":
          if (vscode.workspace.getConfiguration().get("quickLogUtil.pythonLogString") === "") {
            logToInsert = `print(f"${text}: \{${text}\}")`;
          } else {
            logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.pythonLogString");
          }
          break;
        case "shellscript":
          if (vscode.workspace.getConfiguration().get("quickLogUtil.shellscriptLogString") === "") {
            logToInsert = `echo "${text}: \$${text}"`;
          } else {
            logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.shellscriptLogString");
          }
          break;
        case "javascript":
        case "typescript":
          if (vscode.workspace.getConfiguration().get("quickLogUtil.javascriptLogString") === "") {
            logToInsert = `functions.logger.info(\`${text}: \$\{${text}\}\`, { structuredData: true });`
            // logToInsert = `console.log(\`${text}: \$\{${text}\}\`);`;
          } else {
            logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.javascriptLogString");
          }
          break;
        case "cpp":
          if (vscode.workspace.getConfiguration().get("quickLogUtil.cppLogString") === "") {
            logToInsert = `std::cout << "${text}: " << ${text} << std::endl;`;
          } else {
            logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.cppLogString");
          }
          break;
        case "c":
          if (vscode.workspace.getConfiguration().get("quickLogUtil.cLogString") === "") {
            logToInsert = `printf("${text}: %d\\n", ${text});`;
          } else {
            logToInsert = vscode.workspace.getConfiguration().get("quickLogUtil.cLogString");
          }
          break;

        default:
          return;
      }
      logToInsert = logToInsert.replace(/{var}/g, text);
      vscode.commands
        .executeCommand("editor.action.insertLineAfter")
        .then(() => {
          insertText(logToInsert);
        })
    }
  );
  context.subscriptions.push(insertLogStatement);

  const deleteAllLogStatements = vscode.commands.registerCommand(
    "extension.deleteAllLogStatements",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const document = editor.document;
      const documentText = editor.document.getText();

      let workspaceEdit = new vscode.WorkspaceEdit();

      const logStatements = getAllLogStatements(editor.document.languageId, document, documentText);
      deleteFoundLogStatements(workspaceEdit, document.uri, logStatements);
    }
  );
  context.subscriptions.push(deleteAllLogStatements);
}
exports.activate = activate;

function deactivate() { }

exports.deactivate = deactivate;
