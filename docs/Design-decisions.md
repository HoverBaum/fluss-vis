# Design decisions

This document keeps track of design decisions made.
Each decision has a date, decision text and optionally a description.

>Interaction design should follow users intend. I want to remove an input -> x button on input even though edge could be deleted but that is not how user thinks about what they want to do.

## 2025-03-28 Adding Juice to interactions

[Juice](https://garden.bradwoods.io/notes/design/juice) is used in game development to refer to:

>Juice is the non-essential visual, audio and haptic effects that enhance the player's experience.

We follow this principle and want to make using Fluss-Vis a fun experience by introducing Juice. We believe that making the tool fun and engaging to use will lead to a higher engagement of users, helping us to spread the word. Ultimately enabling us to grow. For now we focus on a smaller feature set but make that super fun.

Aspect of Juice in our editor so far:

- Things that enter or exit fade in and out. We introduce an animationState to edges and nodes for this. For the animations we rely on [motion](https://motion.dev/) and CSS transitions.
- New nodes "bounce onto" the editors surface.
- Little "micro animations" help to drive home a point and direct users attention. Like the little blobs that spread out when you connect a new edge. This we do using [Lottie](https://lottiereact.com/), we did [research on Lottie](./research/micro-animations.md)

## 2025-03-28 Introducing colors

While building on a grayscale Shadcn design, we are slowly introducing colors. We started with a pink and blue color, adding darker variations to the mix. For now Pink signifies "danger" and blue "success" and "take this action".

- Pink: #fe91e6
- Deep Pink: #db29b4
- Light Blue: #a1cef2
- Blue: #378acd

Pink is used for:

- Disallowed actions - you can not connect here
- Dangerous actions - delete
- Disappearing or deleted elements

Blue is used for:

- Take this action now - primary button or "connect here"
- Success
- Newly created things to direct attention

Hendrik build this color pallet based on his other website by combining his blogs blue with the there used orange by forming a gradient between the two from which the pink was picked.

## 2025-03-12 Hover to remove

Buttons to remove inputs and output will only appear on hover. We do this to keep the design more streamlined. Focussing on the flow in general and specific actions when users want to take them.
This leans a bit more towards "expert app", as users need to know that this feature exists instead of every possible interaction being presented to the user up-front.

## 2025-03-10 Double-click to edit

We remove the Edit button on Nodes in favor of Double Clicking to open edit.
This leads to a more streamlined design with the assumption that double click to edit is intuitive - thus we need no explicit "edit button".

## 2025-02-26 Button variants

We will use `outline` buttons for things that can be picked from a list.

`primary` should be use sparingly and not for always visible UI elements of the Editor.

`secondary` should be used for always visible UI elements.

`ghost` will not be used!
