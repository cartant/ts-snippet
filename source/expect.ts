/**
 * @license Copyright © 2017 Nicholas Jamieson et al. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-snippet
 */

export class Expect {

    constructor(
        public toHaveError: (expectedMessage?: RegExp) => void,
        public toInferType: (variableName: string, expectedType: string) => void
    ) {}
}
