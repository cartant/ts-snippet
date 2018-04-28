/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */
/*tslint:disable:no-invalid-this no-unused-expression*/

import { expect } from "chai";
import { Compiler } from "./compiler";
import { timeout } from "./timeout-spec";

describe("Compiler", function (): void {

    this.timeout(timeout);

    describe("compile", () => {

        it("should compile the snippet", () => {

            const compiler = new Compiler();
            const program = compiler.compile({
                "snippet.ts": `
                    import * as Lint from "tslint";
                    const pi: number = 3.14159265359;
                `
            });

            expect(program).to.be.an("object");
            expect(program.getSourceFile("snippet.ts")).to.be.an("object");
            expect(compiler.getDiagnostics("snippet.ts")).to.be.empty;
        });

        it("should compile multiple snippet files", () => {

            const compiler = new Compiler();
            const program = compiler.compile({
                "other.ts": `
                    export const other = "other";
                `,
                "snippet.ts": `
                    import { other } from "./other";
                    console.log(other);
                `
            });

            expect(program).to.be.an("object");
            expect(program.getSourceFile("other.ts")).to.be.an("object");
            expect(program.getSourceFile("snippet.ts")).to.be.an("object");
            expect(compiler.getDiagnostics("other.ts")).to.be.empty;
            expect(compiler.getDiagnostics("snippet.ts")).to.be.empty;
        });

        it("should support recompiling snippets", () => {

            console.time("1");

            const compiler = new Compiler();
            let program = compiler.compile({
                "snippet.ts": `
                    const pi: string = 3.14159265359;
                `
            });

            expect(program).to.be.an("object");
            expect(program.getSourceFile("snippet.ts")).to.be.an("object");
            expect(compiler.getDiagnostics("snippet.ts")).to.not.be.empty;

            console.timeEnd("1");
            console.time("2");

            program = compiler.compile({
                "snippet.ts": `
                    const pi: number = 3.14159265359;
                `
            });

            expect(program).to.be.an("object");
            expect(program.getSourceFile("snippet.ts")).to.be.an("object");
            expect(compiler.getDiagnostics("snippet.ts")).to.be.empty;

            console.timeEnd("2");
        });

        it("should support options", () => {

            const compiler = new Compiler({ moduleResolution: "node", target: "es2015" });
            const program = compiler.compile({
                "snippet.ts": `
                    const person = Object.assign({}, { name: "alice" });
                `
            });

            expect(program).to.be.an("object");
            expect(program.getSourceFile("snippet.ts")).to.be.an("object");
            expect(compiler.getDiagnostics("snippet.ts")).to.be.empty;
        });
    });
});
