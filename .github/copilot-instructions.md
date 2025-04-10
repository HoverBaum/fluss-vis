# 🧭 Fluss-Viz Coding Guidelines

## 🌊 What is Fluss Viz?

**Fluss Viz** is a visual development toolkit for building data flows in TypeScript.

This tool creates a visual frame that developers can fill with TypeScript logic. We aim to separate concerns by moving orchestration into a visual space while keeping implementation firmly rooted in fully typed, expressive TypeScript. Fluss Viz handles logic execution and automatically parallelizes async operations where possible.

### 🔑 Key Principles

- Targeted at Developers
- Easy and fun to use
- Fully Type-Safe
- 0-Dependencies
- Visual orchestration, TypeScript-powered logic

This is a living document to ensure our frontend code stays **consistent**, **readable**, and **fun to work with**. These are not rigid rules, but strong opinions that guide how we build.

---

## 🧱 Project Structure

- **PascalCase** for React component filenames: `MyComponent.tsx`
- **camelCase** for all other TypeScript files: `someUtility.ts`
- Feature-based folders in `/app`, with colocated files whenever possible.
- If a folder grows too large, create a `_feature` subfolder.
- Shared components used across multiple features go into `/components`.
- Shadcn-based components go into `/components/ui`.

```tsx
app/
  editor/
    page.tsx
    Editor.tsx
    EditorCanvas.tsx
components/
  FlowNode.tsx
components/ui/
  Button.tsx // from Shadcn
```

---

## ⚛️ React Conventions

- Prefer `const Component = () => {}` over function declarations.
- Always use **named exports**.
- Import React hooks and utilities directly:

```ts
// ✅ Preferred
import { useEffect, useState } from 'react'

// 🚫 Avoid
import React from 'react'
React.useEffect(...)
```

- Keep components **small and simple**.
- A component is the unit we think in — no distinction between “logic” and “UI” components.
- Use **custom hooks** only when:
  - Logic is reused
  - Component complexity becomes unmanageable

```tsx
// ✅ Keep simple logic inline
const Counter = () => {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// ✅ Extract hook only when reused
const useFormErrors = (fields: string[]) => {
  // some reusable logic
}
```

---

## 🧪 Testing Philosophy

We follow the [Testing Trophy](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html):

- ✅ TypeScript is our first line of defense
- ✅ Unit tests for pure functions or complex logic
- ✅ Integration tests using `@testing-library/react` to simulate user behavior
- 🚫 Very limited E2E tests — only for happy paths

```ts
// ✅ Unit test example
describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })
})

// ✅ Integration test
render(<MyComponent />)
userEvent.click(screen.getByText('Submit'))
expect(screen.getByText('Success')).toBeInTheDocument()
```

---

## 🎨 Styling Guidelines

- TailwindCSS v4 with automatic class sorting via Prettier plugin.
- Follow Tailwind’s internal order: layout-related classes first, decorative ones last.
- **Never modify** Shadcn components directly — wrap or extend them instead.
- Custom color palette:

```ts
// tailwind.config.ts
colors: {
  'fluss-pink': 'hsl(313 98% 78%)',
  'fluss-pink-deep': 'hsl(313 71% 51%)',
  'fluss-blue': 'hsl(207 60% 51%)',
  'fluss-blue-light': 'hsl(207 76% 79%)',
  'danger': 'hsl(313 71% 51%)',
  'danger-foreground': 'hsl(313 99% 99%)',
  'positive': 'hsl(207 76% 79%)',
}
```

### Color Semantics

- **Pink** = Destructive or invalid (e.g. delete buttons, errors)
- **Blue** = Positive or primary actions (e.g. submit, create)

> Primary buttons should be used sparingly — ideally one per screen.

---

## 🧠 TypeScript

- Always use `type` instead of `interface`
- Avoid `enum`s — use union types instead:

```ts
// ✅
type Role = 'admin' | 'user' | 'guest'

// 🚫
enum Role {
  Admin,
  User,
  Guest
}
```

- Enforce strict typings — avoid `any`
- Use clear, meaningful names for types and functions
- Write **self-documenting code** but use comments where assumptions or business logic needs to be explained

```ts
// ❓ What is happening here?
const a = b + c - d

// ✅ Clear naming & comment
const priceAfterDiscount = basePrice + tax - discount // includes VAT
```

---

## 🧰 Code Style

- Formatting and linting is enforced via Prettier and ESLint
- Follow readable, verbose code style
- Prefer explicit, intention-revealing code over clever hacks

```ts
// ✅ Clear
const hasPermission = user.role === 'admin' || user.permissions.includes('edit')

// 🚫 Too clever
const canEdit = user?.role === 'admin' || user?.permissions?.some(p => p === 'edit')
```

---

## 🧠 Commit Messages

We use [gitmoji](https://gitmoji.dev/) to prefix our commit messages with relevant emojis:

- ✨ `feat:` A new feature
- 🐛 `fix:` A bug fix
- 🔥 `remove:` Removing code or files
- 📚 `docs:` Documentation only changes
- 🔧 `chore:` Development setup or tooling

Example:

```sh
✨ Add drag-and-drop to editor canvas
🐛 Fix node not rendering on reconnect
📚 Document color palette in README
```

---

## 🔍 Code Reviews

- Check for performance issues (e.g., unnecessary renders, large state updates)
- Validate clear naming and structure
- Favor centralization of shared logic and styling
- Dependencies should help — but keep to a minimum

---

## 🧠 Philosophy

- Code should **speak for itself**
- Think in **components**, not files or layers
- Prioritize **readability and developer intent**
- We believe in **fun**, **fluid UX** — we embrace micro animations, juice, and clarity

> "Make it fun to use. If it feels good, it probably *is* good."
