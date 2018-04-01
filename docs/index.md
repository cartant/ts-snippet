`ts-snippet` is a TypeScript snippet compiler for any test framework. It exposes an expectaion-based API so that a snippet's compilation can be tested for failure or success and so that inferred types can be tested, too.

It can be used with [AVA](https://github.com/avajs/ava), [Jasmine](https://github.com/jasmine/jasmine), [Jest](https://facebook.github.io/jest/), [Mocha](https://github.com/mochajs/mocha) or [Tape](https://github.com/substack/tape).

Using Jasmine or Mocha, the tests look something like this:

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

  it("should infer the mapped type", () => {
    expectSnippet(`
      import * as Rx from "rxjs";
      const source = Rx.Observable.of(1);
      const mapped = source.map(x => x.toString());
    `).toInfer("mapped", "Observable<string>");
  });
});
```

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-103034213-2', 'auto');
    ga('send', 'pageview');
</script>