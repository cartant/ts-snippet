/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import { Compiler } from "./compiler";
import { Expect } from "./expect";
import { snippet } from "./snippet";

export function expecter(
    factory: (code: string) => string = code => code,
    compilerOptions?: object,
    rootDirectory?: string
): (code: string) => Expect {

    const compiler = new Compiler(compilerOptions, rootDirectory);
    return (code: string) => snippet({
        "snippet.ts": factory(code)
    }, compiler).expect("snippet.ts");
}
