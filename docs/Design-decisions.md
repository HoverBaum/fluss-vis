# Design decisions

This document keeps track of design decisions made.
Each decision has a date, decision text and optionally a description.

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
