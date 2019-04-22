/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import { ExecutionContext } from "ava";
import { Compiler } from "../compiler";
import { Expect } from "../expect";
import { snippet as _snippet, Snippet } from "../snippet";

export { Compiler };
export { Expect };

export function expecter(
  factory: (code: string) => string = code => code,
  compilerOptions?: object,
  rootDirectory?: string
): (context: ExecutionContext, code: string) => Expect {
  const compiler = new Compiler(compilerOptions, rootDirectory);
  return (context: ExecutionContext, code: string) =>
    snippet(
      context,
      {
        "snippet.ts": factory(code)
      },
      compiler
    ).expect("snippet.ts");
}

export function snippet(
  context: ExecutionContext,
  files: { [fileName: string]: string },
  compiler?: Compiler
): Snippet {
  const s = _snippet(files, compiler);
  s.assertFail = (message: string) => context.fail(message);
  s.assertPass = () => context.pass();
  return s;
}
