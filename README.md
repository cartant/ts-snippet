# ts-snippet

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/ts-snippet/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/ts-snippet.svg)](https://www.npmjs.com/package/ts-snippet)
[![Build status](https://img.shields.io/travis/cartant/ts-snippet.svg)](http://travis-ci.org/cartant/ts-snippet)
[![dependency status](https://img.shields.io/david/cartant/ts-snippet.svg)](https://david-dm.org/cartant/ts-snippet)
[![devDependency Status](https://img.shields.io/david/dev/cartant/ts-snippet.svg)](https://david-dm.org/cartant/ts-snippet#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/ts-snippet.svg)](https://david-dm.org/cartant/ts-snippet#info=peerDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/cartant/ts-snippet.svg)](https://greenkeeper.io/)

### What is it?

`ts-snippet` is a TypeScript snippet compiler for any test framework.

It does not run the compiled snippets. Instead, it provides assertion methods that can be used to test the TypeScript programs compiled from the snippets.

### Why might you need it?

I created the `ts-snippet` package out of the need to test overloaded TypeScript functions that have many overload signatures.

The order in which overload signatures are specified is critical and the most specific overloads need to be placed first - as TypeScript will match the first compatible overload signature.

Without using `ts-snippet`, it's simple to write tests that establish whether or not TypeScript code compiles, but it's more difficult to write tests that establish whether type inferences are correct (especially when `any` is involved) or whether types are intentionally incompatible (and generate compilation errors).

`ts-snippet` includes assertions that will verify whether inferred types are what's expected and whether compilation succeeds or fails.

If you need to peform similar assertions, you might find `ts-snippet` useful.

For an example of how `ts-snippet` can be used to write tests, checkout the [`research-spec.ts`](https://github.com/cartant/ts-action/blob/v2.0.2/source/research-spec.ts) file in my `ts-action` repo.

## Install

Install the package using npm:

```
npm install ts-snippet --save-dev
```

## Usage

This simplest way to use `ts-snippet` is to create a snippet expectation function using `expecter`:

```ts
import { expecter } from "ts-snippet";

describe("observables", () => {

  const expectSnippet = expecter();

  it("should infer the source's type", () => {
    expectSnippet(`
      import * as Rx from "rxjs";
      const source = Rx.Observable.of(1);
    `).toInfer("source", "Observable<number>");
  });
});
```

`expecter` can be passed a factory so that common imports can be specified in just one place. For example:

```ts
import { expecter } from "ts-snippet";

describe("observables", () => {

  const expectSnippet = expecter(code => `
    import * as Rx from "rxjs";
    ${code}
  `);

  it("should infer the source's type", () => {
    expectSnippet(`
      const source = Rx.Observable.of(1);
    `).toInfer("source", "Observable<number>");
  });
});
```

Alternatively, the package exports a `snippet` function that returns a `Snippet` instance, upon which assertions can be made.

The `snippet` function takes an object containing one or more files - with the keys representing the file names and the values the file content (as strings). The function also takes an optional `Compiler` instance - if not specified, a `Compiler` instance is created within the `snippet` call. With snippets that import large packages (such as RxJS) re-using the compiler can effect significant performance gains.

Using Mocha, the tests look something like this:

```ts
import { Compiler, snippet } from "ts-snippet";

describe("observables", () => {

  let compiler: Compiler;

  before(() => {
    compiler = new Compiler();
  });

  it("should infer the source's type", () => {
    const s = snippet({
      "snippet.ts": `
        import * as Rx from "rxjs";
        const source = Rx.Observable.of(1);
      `
    }, compiler);
    s.expect("snippet.ts").toInfer("source", "Observable<number>");
  });

  it("should infer the mapped type", () => {
    const s = snippet({
      "snippet.ts": `
        import * as Rx from "rxjs";
        const source = Rx.Observable.of(1);
        const mapped = source.map(x => x.toString());
      `
    }, compiler);
    s.expect("snippet.ts").toInfer("mapped", "Observable<string>");
  });
});
```

If the BDD-style expectations are not to your liking, there are alternate methods that are more terse.

When using `ts-snippet` with AVA or tape, the import should specify the specific subdirectory so that the appropriate assertions are configured and the assertions count towards the test runner's plan.

Using the tape-specific import and terse assertions, tests would look something like this:

```ts
import * as tape from "tape";
import { snippet } from "ts-snippet/tape";

tape("should infer Observable<number>", (t) => {
  t.plan(1);
  const s = snippet(t, {
    "snippet.ts": `
      import * as Rx from "rxjs";
      const source = Rx.Observable.from([0, 1]);
    `
  });
  s.infer("snippet.ts", "source", "Observable<number>");
});
```

For an example of how `ts-snippet` can be used, have a look at [these tests](https://github.com/cartant/ts-action/blob/master/source/research-spec.ts) in `ts-action`.

## API

```ts
function expecter(
  factory: (code: string) => string = code => code,
  compilerOptions?: object
): (code: string) => Expect;

function snippet(
  files: { [fileName: string]: string },
  compiler?: Compiler
): Snippet;
```

```ts
interface Snippet {
  fail(fileName: string, expectedMessage?: RegExp): void;
  expect(fileName: string): Expect;
  infer(fileName: string, variableName: string, expectedType: string): void;
  succeed(fileName: string): void;
}

interface Expect {
  toFail(expectedMessage?: RegExp): void;
  toInfer(variableName: string, expectedType: string): void;
  toSucceed(): void;
}
```