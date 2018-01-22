/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

export class Expect {

    constructor(
        public toFail: (expectedMessage?: RegExp) => void,
        public toInfer: (variableName: string, expectedType: string) => void,
        public toSucceed: () => void
    ) {}
}
