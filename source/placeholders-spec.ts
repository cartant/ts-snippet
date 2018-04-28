/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */
/*tslint:disable:no-unused-expression*/

import { expecter } from "./expecter";

describe("placeholders", () => {

    const expectSnippet = expecter();

    it("should be importable into a snippet", () => {

        const expect = expectSnippet(`
            import * as placeholders from "./source/placeholders";
            const assignedConstant = placeholders.c1;
            let assignedVariable = placeholders.v2;
            declare const declaredConstant: placeholders.T3;
            declare let declaredVariable: placeholders.T4;
        `);
        expect.toInfer("assignedConstant", "T1");
        expect.toInfer("assignedVariable", "T2");
        expect.toInfer("declaredConstant", "T3");
        expect.toInfer("declaredVariable", "T4");
    });
});
