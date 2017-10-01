/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-snippet
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Compiler } from "./compiler";
import { areEquivalentTypeStrings, getVariables, snippet, Snippet } from "./snippet";

describe("Snippet", () => {

    describe("areEquivalentTypeStrings", () => {

        it("should compare simple types", () => {

            expect(areEquivalentTypeStrings("number", "string")).to.be.false;
            expect(areEquivalentTypeStrings("number", "number")).to.be.true;
        });

        it("should ignore whitespace differences", () => {

            expect(areEquivalentTypeStrings("Observable<number>", "Observable< number >")).to.be.true;
        });
    });

    describe("getVariables", () => {

        it("should get the variables", () => {

            const compiler = new Compiler();
            const program = compiler.compile({
                "snippet.ts": `
                    let a = 1;
                    let b = "two";
                    let c = [0];
                `
            });
            const sourceFile = program.getSourceFile("snippet.ts");
            const variables = getVariables(program, sourceFile);

            expect(variables).to.deep.equal({
                a: "number",
                b: "string",
                c: "number[]"
            });
        });
    });

    describe("snippet", () => {

        describe("error", () => {

            it("should not throw if an error occurs", () => {

                const snip = snippet({
                    "a.ts": "let a: string = 1;"
                });

                expect(() => snip.error("a.ts")).to.not.throw();
            });

            it("should not throw if a matching error occurs", () => {

                const snip = snippet({
                    "a.ts": "let a: string = 1;"
                });

                expect(() => snip.error("a.ts", /is not assignable to type 'string'/)).to.not.throw();
            });

            it("should throw if a non-matching error occurs", () => {

                const snip = snippet({
                    "a.ts": "let a: string = 1;"
                });

                expect(() => snip.error("a.ts", /is not assignable to type 'number'/)).to.throw();
            });

            it("should throw if no error occurs", () => {

                const snip = snippet({
                    "a.ts": "let a: number = 1;"
                });

                expect(() => snip.error("a.ts")).to.throw();
            });
        });

        describe("expect", () => {

            describe("toHaveError", () => {

                it("should not throw if an error occurs", () => {

                    const snip = snippet({
                        "a.ts": "let a: string = 1;"
                    });

                    expect(() => snip.expect("a.ts").toHaveError()).to.not.throw();
                });

                it("should not throw if a matching error occurs", () => {

                    const snip = snippet({
                        "a.ts": "let a: string = 1;"
                    });

                    expect(() => snip.expect("a.ts").toHaveError(/is not assignable to type 'string'/)).to.not.throw();
                });

                it("should throw if a non-matching error occurs", () => {

                    const snip = snippet({
                        "a.ts": "let a: string = 1;"
                    });

                    expect(() => snip.expect("a.ts").toHaveError(/is not assignable to type 'number'/)).to.throw();
                });

                it("should throw if no error occurs", () => {

                    const snip = snippet({
                        "a.ts": "let a: number = 1;"
                    });

                    expect(() => snip.expect("a.ts").toHaveError()).to.throw();
                });
            });

            describe("toInferType", () => {

                let snip: Snippet;

                beforeEach(() => {

                    snip = snippet({
                        "a.ts": "let a = 1;",
                        "b.ts": "let b = 2;"
                    });
                });

                it("should throw if a variable is not found", () => {

                    expect(() => snip.expect("a.ts").toInferType("x", "number")).to.throw(/variable x not found/i);
                    expect(() => snip.expect("b.ts").toInferType("x", "number")).to.throw(/variable x not found/i);
                });

                it("should throw if a variable has an unexpected type", () => {

                    expect(() => snip.expect("a.ts").toInferType("a", "string")).to.throw(/expected a: number to be string/i);
                    expect(() => snip.expect("b.ts").toInferType("b", "string")).to.throw(/expected b: number to be string/i);
                });

                it("should not throw if a variable has the expected type", () => {

                    expect(() => snip.expect("a.ts").toInferType("a", "number")).to.not.throw();
                    expect(() => snip.expect("b.ts").toInferType("b", "number")).to.not.throw();
                });
            });
        });

        describe("infer", () => {

            let snip: Snippet;

            beforeEach(() => {

                snip = snippet({
                    "a.ts": "let a = 1;",
                    "b.ts": "let b = 2;"
                });
            });

            it("should throw if a variable is not found", () => {

                expect(() => snip.infer("a.ts", "x", "number")).to.throw(/variable x not found/i);
                expect(() => snip.infer("b.ts", "x", "number")).to.throw(/variable x not found/i);
            });

            it("should throw if a variable has an unexpected type", () => {

                expect(() => snip.infer("a.ts", "a", "string")).to.throw(/expected a: number to be string/i);
                expect(() => snip.infer("b.ts", "b", "string")).to.throw(/expected b: number to be string/i);
            });

            it("should not throw if a variable has the expected type", () => {

                expect(() => snip.infer("a.ts", "a", "number")).to.not.throw();
                expect(() => snip.infer("b.ts", "b", "number")).to.not.throw();
            });
        });
    });
});
