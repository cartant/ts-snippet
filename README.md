# ts-snippet

[![NPM version](https://img.shields.io/npm/v/ts-snippet.svg)](https://www.npmjs.com/package/ts-snippet)
[![Build status](https://img.shields.io/travis/cartant/ts-snippet.svg)](http://travis-ci.org/cartant/ts-snippet)
[![dependency status](https://img.shields.io/david/cartant/ts-snippet.svg)](https://david-dm.org/cartant/ts-snippet)
[![devDependency Status](https://img.shields.io/david/dev/cartant/ts-snippet.svg)](https://david-dm.org/cartant/ts-snippet#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/ts-snippet.svg)](https://david-dm.org/cartant/ts-snippet#info=peerDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/cartant/ts-snippet.svg)](https://greenkeeper.io/)

### What is it?

`ts-snippet` is a TypeScript snippet testing library for any test framework.

### Why might you need it?

...

## Install

Install the package using npm:

```
npm install ts-snippet --save-dev
```

## Usage

...

```ts
it("should infer the correct type", () => {
  const s = snippet({
    "snippet.ts": `
      import * as Rx from "rxjs";
      let ob = Rx.Observable.from([0, 1]);
    `
  });
  s.expect("snippet.ts").toInfer("ob", "Observable<number>");
});
```

...

```ts
it("should be incompatible with Observable<number>", () => {
  const s = snippet({
    "snippet.ts": `
      import * as Rx from "rxjs";
      let ob: Rx.Observable<number> = Rx.Observable.from([0, "1"]);
    `
  });
  s.expect("snippet.ts").toFail(/is not assignable to type 'Observable<number>'/);
});
```

...

## API

...