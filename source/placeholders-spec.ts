/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */
/*tslint:disable:no-unused-expression*/

import { expecter } from "./expecter";

describe("placeholders", () => {

    const expectSnippet = expecter(code => `
        import * as placeholders from "./source/placeholders";
        ${code}
    `);

    it("should be importable into a snippet", () => {

        const expect = expectSnippet(`
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

    it("should have incompatible types", () => {

        const expect = expectSnippet(`
            let v: placeholders.T1 = placeholders.v2;
        `);
        expect.toFail(/type 'T2' is not assignable to type 'T1'/i);
    });
});
