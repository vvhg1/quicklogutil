# Quick Log Util
This is an extension for Visual Studio Code that provides a quick and convenient way to insert and delete log statements in your code. The extension supports multiple languages including C#, Python, ShellScript, JavaScript, TypeScript, C++, and C.

#

## Features
- Insert log statements at the current cursor position
- Delete all log statements in the current document
- Customizable log statements for each supported language

#

## Usage
- Install the extension
- Open a document in one of the supported languages
- **To insert a log statement for the "word" under the cursor:**
    - Press `Ctrl/Cmd+Shift+L` 
    - Or press `Ctrl/Cmd+Shift+P` and run `Insert Log Statement`
    ![screenshot](https://raw.githubusercontent.com/vvhg1/quicklogutil/main/images/undercursor.gif)
- **To insert a log statement for longer text, highlight the text and:**
    - Press `Ctrl/Cmd+Shift+L`
    - Or press `Ctrl/Cmd+Shift+P` and run `Insert Log Statement`
    ![screenshot](https://raw.githubusercontent.com/vvhg1/quicklogutil/main/images/highlighted.gif)
- **The log statement for a specific language can be customized via Settings:**
    - `{var}` represents the variable name that will be logged
    - Either open the UI settings for the extension and modify the Log String for the language you want to customize.
    - Or open the settings editor and add `"quickLogUtil.languageLogString": "yourcustomstring"` where language is the language you want to customize (e.g. `"consoleLogUtils.csharpLogToInsert": "Console.WriteLine($\"{var}: {{var}}\");"` )

#

## Settings
The extension provides the following settings:

- `quickLogUtil.unityLogString`: Custom log statement for Unity C# projects
- `quickLogUtil.csharpLogString`: Custom log statement for C# projects
- `quickLogUtil.pythonLogString`: Custom log statement for Python projects
- `quickLogUtil.shellscriptLogString`: Custom log statement for ShellScript projects
- `quickLogUtil.javascriptLogString`: Custom log statement for JavaScript/TypeScript projects
- `quickLogUtil.cppLogString`: Custom log statement for C++ projects
- `quickLogUtil.cLogString`: Custom log statement for C projects

#

## Known Issues
None at the moment.

#

## Release Notes
1.0.0
Initial release of **Quick Log Util**

#

## Support
If you have any questions or issues, please open an issue on the [Github repository](https://github.com/vvhg1/quicklogutil.git)

#

## Contribution
Feel free to submit pull requests or issues on the [Github repository](https://github.com/vvhg1/quicklogutil.git)

#

## License

This extension is licensed under the MIT license.