/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

import { Compiler, CompilerOptions } from "./compiler";
import { Expect } from "./expect";
import { snippet } from "./snippet";

export function expecter(
  factory: (code: string) => string,
  compiler: Compiler
): (code: string) => Expect;
export function expecter(
  factory?: (code: string) => string,
  compilerOptions?: CompilerOptions,
  rootDirectory?: string
): (code: string) => Expect;
export function expecter(
  factory: (code: string) => string = (code) => code,
  compilerOrOptions?: Compiler | CompilerOptions,
  rootDirectory?: string
): (code: string) => Expect {
  const compiler =
    compilerOrOptions instanceof Compiler
      ? compilerOrOptions
      : new Compiler(compilerOrOptions, rootDirectory);
  return (code: string) =>
    snippet(
      {
        "snippet.ts": factory(code),
      },
      compiler
    ).expect("snippet.ts");
}
