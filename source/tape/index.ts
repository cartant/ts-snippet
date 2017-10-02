/**
 * @license Copyright © 2017 Nicholas Jamieson et al. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import * as tape from "tape";
import { Compiler } from "../compiler";
import { snippet as _snippet, Snippet } from "../snippet";

export { Compiler };
export { Expect } from "../expect";

export function snippet(
    context: tape.Test,
    files: { [fileName: string]: string },
    compiler?: Compiler
): Snippet {

    const s = _snippet(files, compiler);
    s.assertFail = (message: string) => context.fail(message);
    s.assertPass = () => context.pass();
    return s;
}
