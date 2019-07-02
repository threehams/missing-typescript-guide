// avoid polluting other files
export {};

// go over "I narrowed and it widened my type in a callback"
// https://github.com/Microsoft/TypeScript/issues/9998

// tl;dr rules for avoiding this:
// 1. never reassign parameters. https://eslint.org/docs/rules/no-param-reassign
// 2.

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

// if you don't have to deal with null, default values work well
const getLengthWithDefault = (item: string = "") => {
  item = ""; // comment out this line to remove error
  item.length; // OK
  maybeAsync(() => {
    item.length;
  });
};
getLengthWithDefault(undefined);

const getLength = (item: string | null) => {
  if (!item) {
    return 0;
  }
  item.length; // OK
  maybeAsync(() => {
    item.length;
  });
};

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

function f(a: number[] | undefined) {
  if (a === undefined) {
    return [];
  }

  // Works
  a = a.map(x => x + 1);
  return a.map(
    x =>
      // Error: Object is possibly 'undefined'.
      x + a.length,
  );
}
