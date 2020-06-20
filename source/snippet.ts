/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */
/*tslint:disable:member-ordering*/

import * as tsutils from "tsutils";
import * as ts from "typescript";
import { Compiler } from "./compiler";
import { Expect } from "./expect";

export class Snippet {
  private _program: ts.Program;
  public assertFail: (message: string) => void = (message: string) => {
    throw new Error(message);
  };
  public assertPass: () => void = () => {};

  constructor(
    private _files: { [fileName: string]: string },
    private _compiler: Compiler
  ) {
    this._program = _compiler.compile(_files);
  }

  fail(fileName: string, expectedMessage?: RegExp): void {
    const diagnostics = this._getDiagnostics(fileName);
    const messages = diagnostics.map(this._compiler.formatDiagnostic);
    const matched = messages.some((message) =>
      expectedMessage ? expectedMessage.test(message) : true
    );
    if (!matched) {
      this.assertFail(
        expectedMessage
          ? `Expected an error matching ${expectedMessage}`
          : "Expected an error"
      );
    } else {
      this.assertPass();
    }
  }

  expect(fileName: string): Expect {
    return new Expect(
      this.fail.bind(this, fileName),
      this.infer.bind(this, fileName),
      this.succeed.bind(this, fileName)
    );
  }

  infer(fileName: string, variableName: string, expectedType: string): void {
    const sourceFile = this._program.getSourceFile(fileName)!;
    const variables = getVariables(this._program, sourceFile);
    const actualType = variables[variableName];
    if (!actualType) {
      this.assertFail(`Variable '${variableName}' not found`);
    } else if (!areEquivalentTypeStrings(expectedType, actualType)) {
      this.assertFail(
        `Expected '${variableName}: ${actualType}' to be '${expectedType}'`
      );
    } else {
      this.assertPass();
    }
  }

  succeed(fileName: string): void {
    const diagnostics = this._getDiagnostics(fileName);
    if (diagnostics.length) {
      const [diagnostic] = diagnostics;
      this.assertFail(this._compiler.formatDiagnostic(diagnostic));
    } else {
      this.assertPass();
    }
  }

  private _getDiagnostics(fileName: string): ts.Diagnostic[] {
    return this._program
      .getSemanticDiagnostics()
      .concat(this._compiler.getDiagnostics(fileName));
  }
}

export function areEquivalentTypeStrings(a: string, b: string): boolean {
  const spaces = /\s/g;
  return a.replace(spaces, "") === b.replace(spaces, "");
}

export function getVariables(
  program: ts.Program,
  sourceFile: ts.SourceFile
): { [variableName: string]: string } {
  const typeChecker = program.getTypeChecker();
  const variables: { [name: string]: string } = {};

  const visitNode = (node: ts.Node) => {
    if (tsutils.isVariableStatement(node)) {
      tsutils.forEachDeclaredVariable(node.declarationList, (node) => {
        variables[node.name.getText()] = typeChecker.typeToString(
          typeChecker.getTypeAtLocation(node)
        );
      });
    } else {
      node.forEachChild(visitNode);
    }
  };

  sourceFile.forEachChild(visitNode);
  return variables;
}

export function snippet(
  files: { [fileName: string]: string },
  compiler?: Compiler
): Snippet {
  return new Snippet(files, compiler || new Compiler());
}
