# The TypeScript Error Guide

TypeScript makes some normally complex tasks very easy, but it can make some seemingly-simple tasks more difficult,

## Some things that were hard: now easy!

Change an API? Change the type and you'll see everywhere you need to update. Need to rename something used in 500 places? Hit F2 and rename.

## Some things that were easy: now hard.

TypeScript actively discourages highly-dynamic code, redefining variables at will, and APIs that put a lot of meaning into strings. What do these look like?

```tsx
const sizes = {
  "size-sm": 1,
  "size-md": 2,
  "size-lg": 3,
};

const getSize = (size: "sm" | "md" | "lg") => {
  return sizes[`size-${size}`];
};
```

This site is all about letting you know about these limitations _without_ all the type-system jargon you'll normally see.

# Diagnostic Codes

TypeScript has a code for every error, such as `ts(2741)`. While the error message may look very different each time, the underlying problem is the same.

If you're hitting a problem, search for that code within this page.

# For Site / Application Developers

## I'm trying to start with an empty object and add properties one by one, and TypeScript gives me errors no matter what I do. I've given up and `// @ts-ignore`d them.

When you create an empty object, there's just no good way for TS to ensure that all properties have been added _after_ the object has already been specified. Don't worry, though - there are lots of ways to accomplish this, and one of them is very concise as well! See: [Build Up Object](examples/build-up-object.ts).

Diagnostic codes: `ts(2339)`, `ts(2741)`

## What's this `never` type?

This is covered in the new handbook under the [never type](https://microsoft.github.io/TypeScript-New-Handbook/chapters/more-on-functions/#never).

Additionally, arrays start out as `never[]` when the type cannot be inferred. See: [Never](examples/never.ts)

## Why isn't TypeScript showing errors on extra properties I have on an object?

TypeScript has a system called "excess property checking" which is a great tradeoff between type safety and developer experience... provided you know how it works. Luckily, it's pretty simple. See: [Excess Property Checking](examples/excess-property-checking.ts).

## How can I get a function to accept an object with a couple extra properties? My code works fine!

Same question as above! Understanding [Excess Property Checking](examples/excess-property-checking.ts) will let you intentionally bypass this check where needed.

## I used `filter` but TS errors and says that something could be null/undefined.

A nullable type is a union type, such as `string | null`. To narrow types in a function like `filter`, an extra annotation is needed for now (TypeScript might make an exception here in the future). See: [Filter and Reduce](examples/filter-reduce.ts).

## Why can't I use `reduce` without errors on the result object?

You can! However, creating an empty object and building it up one property at a time isn't something that can really ever be checked for safety. A simple type assertion is typically all you need. A few different approaches are available at [Filter and Reduce](examples/filter-reduce.ts).

## I have an array of mixed object types. Why can't I narrow based on whether or not a property exists?

You can! You just have to use an `in` check to opt in to less-strict checking of properties. See the tradeoffs and other solutions in [Type Guards](examples/type-guards.ts).

## I checked if something is null, and now TypeScript is complaining that something might be null.

This is usually an example of TS being especially careful with callbacks, as they may or may not be called synchronously. See: [Type Widening](examples/type-widening.ts).

## Is it OK to have an object function argument with a bunch of optional properties?

Maybe! If all the options really are independently optional, that's fine. However, you may have a couple properties which are _exclusive_ of one another. Think of a function that must accept either "a" or "b", but cannot accept both at once. If this covers your case, [Dependent Properties](examples/dependent-properties.ts) can help you.

## I'm using a library, and I seem to need to manually type everything for it.

This can be one of a few issues.

If the library you're using involves two functions that quietly pass information between each other between imports (example: redux `createStore()` and react-redux `connect()` or `useSelector()`), you might be interested in the [Extending Modules](examples/extending-modules.ts) section. This can let you define types _once_ instead of on every usage.

If this isn't the case, your library is likely set up to accept generics. These are like function arguments, but for types. The syntax for these involves angle brackets (`<>`) and can be tricky, so see [Generics](examples/generics.ts) for details.

Finally, some libraries just don't have very good type definitions available, or are so dynamic that creating good library definitions isn't possible, or require types which TypeScript just can't support yet. This is rare, but an example is the [humps](https://github.com/domchristie/humps) library which converts all keys of an object from snake_case to camelCase. For these instances, you might want to use a [Type Assertion](examples/type-assertion.ts). This ties into knowing [when to bail out of types](examples/when-to-bail-out.ts).

## My function accepts string | number as a type and returns string | number. I know I gave it a string but now I have to check for numbers every time.

You're looking for [Generics](examples/generics.ts). These allow you to change the return value based on the arguments. Think of them like function arguments, but for types.

## Hey! I used a generic like you said, and now I'm getting type errors inside my function.

Right! Generics accept anything by default, so your `add()` function suddenly needs to accept arrays, objects, and `null`. You might want to restrict which types you accept using [Bounded Type Parameters](examples/bounded-type-parameters.ts).

## I'm using Object.keys() or Object.entries() and there's some index signature error. Why is the key ending up as a `string`?

This one trips up everyone at some point. There's an explanation at [Object.keys and Object.entries](examples/object-keys-and-entries.ts). Don't worry, there's a reason for it - and a few ways to opt-in to the behavior you want.

## I don't control the object being used. How do I use the `object` type?

## How can I tell TypeScript about a global variable that exists without using @ts-ignore or `any`?

You're looking for the jargony `ambient context` and `ambient declaration`. When you put `declare` in front of a function, constant, or module, you are saying "trust me, this exists, and is of this type." This is especially confusing when looking at the differences between .d.ts and .ts files, so see [Types without implementations](examples/types-without-implementations.ts).

# React-Specific Errors

For most React errors, there's an excellect [cheat sheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet) for using React with TypeScript. This is updated constantly with new information.

## How do I work with `children`? All I get are errors trying to access anything.

A React child is union of many, many possible things which cannot be narrowed except by complex type guards at every object depth. When iterating over children, it's probably best to use `any` and distrust the existence of any property:

```tsx
const containsDiv = React.Children.toArray(children).some((child: any) => {
  return child?.type?.displayName === "Header";
});
```

## I'm getting a "not a constructor function for JSX elements" error.

You're returning something from a function component which React doesn't accept, likely `undefined`. Your code might be fine now, but if it ever hits that `undefined` case, you'll get a runtime error.

```tsx
import React from "react";

interface Props {
  text?: string;
}
const Button = ({ text }: Props) => {
  return text && <button>{text}</button>;
};
```

If `text` isn't supplied to Button, it'll return the current value of `text` (which is `undefined`). React currently throws in this case.

To get a better error message, add a return type annotation to your function component of either `ReactElement` or `ReactElement | null`. This will move the error to the return statement:

```tsx
interface Props {
  text?: string;
}
const Button = ({ text }: Props): ReactElement | null => {
  return text ? <button>{text}</button> : null;
};
```

# For Library Authors

## I want to make my library work with TypeScript. What's all this .d.ts nonsense?

d.ts files are interesting. They allow you to declare the external API for your library without needing to specify

This can be challenging.

## How do I test types?

If you're writing library definitions, [Testing Types](examples/testing-types.ts) can help you, by using the [Conditional Type Checks](https://github.com/dsherret/conditional-type-checks) library.
