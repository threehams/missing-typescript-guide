## Type Narrowing and Widening

Narrowing and widening are both related to

## Where Narrowing is Lost

go over "I narrowed and it widened my type in a callback"
https://github.com/Microsoft/TypeScript/issues/9998

tl;dr rules for avoiding this:

1. never reassign parameters. https://eslint.org/docs/rules/no-param-reassign
2. use `const` unless you need `let` (enable the prefer-const eslint rule)

```tsx
const thing: string = "thing";
if (thing === "thing") {
  thing;
}

const maybeAsync = (callback: () => void) => {
  callback();
};

const getLengthWithReassign = (item: string | null) => {
  // reassigning a parameter marks it as "mutable"
  // assuming that this can change at any time is just a performance /
  // complexity tradeoff in TypeScript
  item = ""; // comment out this line to remove error
  item.length; // OK
  maybeAsync(() => {
    item.length;
  });
};
```

if you don't have to deal with null, default values work well

```tsx
const getLengthWithDefault = (item: string = "") => {
  item.length;
  maybeAsync(() => {
    item.length;
  });
};
getLengthWithDefault(undefined);
```

```tsx
const getLength = (item: string | null) => {
  if (!item) {
    return 0;
  }
  item.length; // OK
  maybeAsync(() => {
    item.length;
  });
};
```

```tsx
const myFunc = (active: boolean) => {
  let className: string;
  if (active) {
    className = "active";
  } else {
    // className = "disabled";
    // return;
  }
  className.length;
  maybeAsync(() => {
    className.length;
  });
};
```