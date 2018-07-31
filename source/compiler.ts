/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import * as ts from "typescript";

// There is an example that uses the LanguageService here:
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services

export class Compiler {

    private _compilerOptions: ts.CompilerOptions;
    private _files: ts.MapLike<{ content: string, version: number }>;
    private _languageService: ts.LanguageService;

    constructor(compilerOptions: object = {}) {

        function normalize(path: string): string {
            return path.replace(/\\/g, "/");
        }

        const { errors, options } = ts.convertCompilerOptionsFromJson({
            moduleResolution: "node",
            skipLibCheck: true,
            target: "es2017",
            ...compilerOptions
        }, normalize(process.cwd()));
        const [error] = errors;
        if (error) {
            throw error;
        }

        this._compilerOptions = options;
        this._files = {};

        const languageServiceHost: ts.LanguageServiceHost = {

            directoryExists: ts.sys.directoryExists,
            fileExists: ts.sys.fileExists,
            getCompilationSettings: () => this._compilerOptions,
            getCurrentDirectory: () => normalize(process.cwd()),
            getDefaultLibFileName: (options: ts.CompilerOptions) => ts.getDefaultLibFilePath(options),
            getScriptFileNames: () => Object.keys(this._files),

            getScriptSnapshot: (fileName: string) => {

                if (this._files[fileName]) {
                    return ts.ScriptSnapshot.fromString(this._files[fileName].content);
                } else if (ts.sys.fileExists(fileName)) {
                    return ts.ScriptSnapshot.fromString(ts.sys.readFile(fileName)!.toString());
                }
                return undefined;
            },

            getScriptVersion: (fileName: string) => {

                return this._files[fileName] && this._files[fileName].version.toString();
            },

            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile
        };
        this._languageService = ts.createLanguageService(
            languageServiceHost,
            ts.createDocumentRegistry()
        );
    }

    compile(files: { [fileName: string]: string }): ts.Program {

        Object.keys(files).forEach((fileName) => {
            if (!this._files[fileName]) {
                this._files[fileName] = { content: "", version: 0 };
            }
            this._files[fileName].content = files[fileName];
            this._files[fileName].version++;
        });
        const program = this._languageService.getProgram();
        if (!program) {
            throw new Error("No program.");
        }
        return program;
    }

    formatDiagnostic(diagnostic: ts.Diagnostic): string {

        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            return `Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        }
        return `Error: ${message}`;
    }

    getDiagnostics(fileName: string): ts.Diagnostic[] {

        return this._languageService.getCompilerOptionsDiagnostics()
            .concat(this._languageService.getSyntacticDiagnostics(fileName))
            .concat(this._languageService.getSemanticDiagnostics(fileName));
    }
}
