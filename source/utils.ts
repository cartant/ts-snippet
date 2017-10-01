/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Klaus Meinhardt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/*tslint:disable*/

import * as ts from "typescript";

export function isVariableStatement(node: ts.Node): node is ts.VariableStatement {
    return node.kind === ts.SyntaxKind.VariableStatement;
}

export function forEachDestructuringIdentifier<T>(
    pattern: ts.BindingPattern,
    fn: (element: ts.BindingElement & { name: ts.Identifier }) => T,
): T | undefined {
    for (const element of pattern.elements) {
        if (element.kind !== ts.SyntaxKind.BindingElement)
            continue;
        let result: T | undefined;
        if (element.name.kind === ts.SyntaxKind.Identifier) {
            result = fn(<ts.BindingElement & { name: ts.Identifier }>element);
        } else {
            result = forEachDestructuringIdentifier(element.name, fn);
        }
        if (result)
            return result;
    }
}

export function forEachDeclaredVariable<T>(
    declarationList: ts.VariableDeclarationList,
    cb: (element: ts.VariableLikeDeclaration & { name: ts.Identifier }) => T,
) {
    for (const declaration of declarationList.declarations) {
        let result: T | undefined;
        if (declaration.name.kind === ts.SyntaxKind.Identifier) {
            result = cb(<ts.VariableDeclaration & { name: ts.Identifier }>declaration);
        } else {
            result = forEachDestructuringIdentifier(declaration.name, cb);
        }
        if (result)
            return result;
    }
}
