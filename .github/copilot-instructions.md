# 🧭 Fluss-Viz Coding Guidelines

## 🌊 What is Fluss Viz?

**Fluss Viz** is a visual development toolkit for building data flows in TypeScript.

This tool creates a visual frame that developers can fill with TypeScript logic. We aim to separate concerns by moving orchestration into a visual space while keeping implementation firmly rooted in fully typed, expressive TypeScript. Fluss Viz handles logic execution and automatically parallelizes async operations where possible.

### 🔑 Key Principles

- Targeted at Developers
- Easy and fun to use
- Fully Type-Safe
- 0-Dependencies after export
- Visual orchestration, TypeScript-powered logic

This is a living document to ensure our frontend code stays **consistent**, **readable**, and **fun to work with**. These are not rigid rules, but strong opinions that guide how we build.

---

## 🧠 Philosophy

- Code should **speak for itself**
- Think in **components**, not files or layers
- Prioritize **readability and developer intent**
- We believe in **fun**, **fluid UX** — we embrace micro animations, juice, and clarity

> "Make it fun to use. If it feels good, it probably *is* good."

---

## 🧑‍💻 Tackling problems

Whenever we tackle a problem we first "take a step back" and think about "what kind of problem is this?" and "which known patterns are in effect here or could we use?".

Asking these questions first help us to see the bigger picture and find solutions that are well tested and easy to understand for future devs.

---

## 🧱 Project Structure

- **PascalCase** for React components: `MyComponent.tsx`
  > _Why?_ Distinguishes component files from utilities and matches React conventions

- **camelCase** for utilities: `someUtility.ts`
  > _Why?_ Follows JavaScript conventions and clearly identifies non-component files

- Feature-based folders in `/app`
  > _Why?_ Keeps related code together, making features easier to maintain and understand

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

## 🧠 TypeScript

- Use `type` over `interface`
  > _Why?_ More consistent behavior and better for union types

- Avoid `enum`s
  > _Why?_ Union types are more idiomatic in TypeScript and have better runtime characteristics

- Clear naming
  > _Why?_ Self-documenting code reduces maintenance burden and improves team communication

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

## ⚛️ React Conventions

- Prefer `const Component = () => {}`
  > _Why?_ Consistent with modern React patterns and works better with TypeScript

- Always use **named exports**
  > _Why?_ Makes imports explicit and improves tooling support

- Import React hooks directly
  > _Why?_ Reduces verbosity and follows modern React patterns

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

## 🗃️ State Management

- Use Zustand stores for state used across multiple components
  > _Why?_ Zustand provides a minimal API with great TypeScript support and reduces prop-drilling

```ts
// ✅ Shared state in Zustand store
export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] }))
}))

// ✅ Simple state reads with getState
const nodes = useFlowStore.getState().nodes
```

- Keep component state (`useState`) for isolated UI elements
  > _Why?_ Local state is simpler to reason about and doesn't impact other components

---

## 🎨 Styling Guidelines

- TailwindCSS with class sorting
  > _Why?_ Ensures consistent class order and improves readability

- Never modify Shadcn directly
  > _Why?_ Preserves upgradeability and maintains consistent component behavior

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

## 🧪 Testing Philosophy

- TypeScript as first defense
  > _Why?_ Catches type-related bugs before runtime and provides better DX

- Unit tests for pure logic
  > _Why?_ Easy to test, maintain, and provides fast feedback

- Integration tests with testing-library
  > _Why?_ Tests components as users would use them

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

## 🔍 Code Reviews

- Check for performance issues (e.g., unnecessary renders, large state updates)
- Validate clear naming and structure
- Favor centralization of shared logic and styling
- Dependencies should help — but keep to a minimum

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
