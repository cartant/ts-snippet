/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import * as ts from "typescript";
import { Compiler } from "./compiler";
import { Expect } from "./expect";
import * as tsutils from "./utils";

export class Snippet {

    private _program: ts.Program;

    constructor(
        private _files: { [fileName: string]: string },
        private _compiler: Compiler
    ) {

        this._program = _compiler.compile(_files);
    }

    error(fileName: string, expectedMessage?: RegExp): void {

        const diagnostics = this._compiler.getDiagnostics(fileName);
        const messages = diagnostics.map(this._compiler.formatDiagnostic);
        const matched = messages.some((message) => expectedMessage ? expectedMessage.test(message) : true);
        if (!matched) {
            throw new Error(expectedMessage ? `Expected an error matching ${expectedMessage}` : "Expected an error");
        }
    }

    expect(fileName: string): Expect {

        return new Expect(this.error.bind(this, fileName), this.infer.bind(this, fileName));
    }

    infer(fileName: string, variableName: string, expectedType: string): void {

        const sourceFile = this._program.getSourceFile(fileName);
        const variables = getVariables(this._program, sourceFile);
        const actualType = variables[variableName];
        if (!actualType) {
            throw new Error(`Variable ${variableName} not found`);
        }
        if (!areEquivalentTypeStrings(expectedType, actualType)) {
            throw new Error(`Expected ${variableName}: ${actualType} to be ${expectedType}`);
        }
    }
}

export function areEquivalentTypeStrings(a: string, b: string): boolean {

    const spaces = /\s/g;
    return a.replace(spaces, "") === b.replace(spaces, "");
}

export function getVariables(program: ts.Program, sourceFile: ts.SourceFile): { [variableName: string]: string } {

    const typeChecker = program.getTypeChecker();
    const variables: { [name: string]: string } = {};

    sourceFile.forEachChild((node) => {
        if (tsutils.isVariableStatement(node)) {
            tsutils.forEachDeclaredVariable(node.declarationList, (node) => {
                variables[node.name.getText()] = typeChecker.typeToString(typeChecker.getTypeAtLocation(node));
            });
        }
    });
    return variables;
}

export function snippet(files: { [fileName: string]: string }, compiler?: Compiler): Snippet {

    return new Snippet(files, compiler || new Compiler());
}
