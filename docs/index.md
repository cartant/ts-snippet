`ts-snippet` is a TypeScript snippet compiler for any test framework. It exposes an expectaion-based API so that a snippet's compilation can be tested for failure or success and so that inferred types can be tested, too.

It can be used with [AVA](https://github.com/avajs/ava), [Jasmine](https://github.com/jasmine/jasmine), [Jest](https://facebook.github.io/jest/), [Mocha](https://github.com/mochajs/mocha) or [Tape](https://github.com/substack/tape).

Using Jasmine or Mocha, the tests look something like this:

```ts
import { Compiler, snippet } from "ts-snippet";

describe("publish", () => {

  let compiler: Compiler;

  before(() => {
    compiler = new Compiler();
  });

  it("should infer the source's type", () => {
    const s = snippet({
      "snippet.ts": `
        import * as Rx from "rxjs";
        let source = Rx.Observable.of(1);
        let published = source.publish();
      `
    }, compiler);
    s.expect("snippet.ts").toInfer("published", "Observable<number>");
  });

  it("should infer the selected type", () => {
    const s = snippet({
      "snippet.ts": `
        import * as Rx from "rxjs";
        let source = Rx.Observable.of(1);
        let published = source.publish(s => s.map(x => x.toString()));
      `
    }, compiler);
    s.expect("snippet.ts").toInfer("published", "Observable<string>");
  });
});
```

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/jZB4ja6SvwGUN4ibgYVgUVYV/cartant/ts-snippet'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/jZB4ja6SvwGUN4ibgYVgUVYV/cartant/ts-snippet.svg' />
</a>