/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import { reuseCompiler } from "./reuse";

describe("reuseCompiler", () => {

    describe("default", () => {

        const expectSnippet = reuseCompiler();

        it("should support snippet expectations", () => {

            expectSnippet(`
                import { expect } from "chai";
                const n: number = expect;
            `).toFail(/not assignable to type 'number'/);
        });
    });

    describe("with factory", () => {

        const expectSnippet = reuseCompiler(code => `import { expect } from "chai"; ${code}`);

        it("should support snippet expectations", () => {

            expectSnippet(`
                const n: number = expect;
            `).toFail(/not assignable to type 'number'/);
        });
    });
});
