## 🏗 Project Goal

Build a **frontend-only React/Next.js application** where:

* **Admin users can create categories**
  (ex: Vehicles, Clothes, Electronics)
* **Admin defines dynamic form schema**
  by adding multiple properties:

  * Property Name
  * Data Type: `string | number | boolean | date | time`
  * UI Type: `text_input | number_input | date_picker | time_picker | toggle | dropdown`
  * Options array for dropdown
* **Users can fill forms based on that schema**
* All data is stored **locally in browser storage (LocalStorage)** using Zustand for state persistence.

No backend required in MVP.

Later we can replace LocalStorage with Supabase.

---

## 🧱 Tech Stack

* **React or Next.js**
* **Zustand (global state + persistence)**
* **React Hook Form (dynamic form engine)**
* **TailwindCSS**
* **Shadcn/UI Components (recommended)**
* **TypeScript**

---

## 🎯 Core Principles

* 100% frontend
* No authentication needed yet
* Data persists using LocalStorage automatically
* Admin UI updates schema stored locally
* User UI renders dynamic inputs based on schema

---

## 👥 Roles (Simulated)

We simulate roles:

### Admin:

* Can add / edit categories
* Can define properties per category
* Can reorder fields (optional)
* Can preview form

### User:

* Choose category
* Fill form
* Submit data
* View their submitted entries

No login required — we assume admin mode is a separate route.

---

## 🗄 Local Data Model (Frontend State Only)

### Category

```ts
interface Category {
  id: string
  name: string
}
```

### Property

```ts
interface Property {
  id: string
  categoryId: string
  label: string
  dataType: "string" | "number" | "boolean" | "date" | "time"
  uiType: "text" | "number" | "toggle" | "date" | "time" | "select"
  options?: string[]
  orderIndex: number
}
```

### Entry

```ts
interface Entry {
  id: string
  categoryId: string
  values: Record<string, any>
  createdAt: number
}
```

---

## 🪝 Zustand Store Requirements

Create separate stores:

### `/stores/categories.ts`

* addCategory
* removeCategory
* load/save from LocalStorage

### `/stores/properties.ts`

* addProperty
* updateProperty
* deleteProperty
* reorderProperties
* load/save from LocalStorage

### `/stores/entries.ts`

* addEntry
* deleteEntry
* load/save from LocalStorage

Use `zustand/middleware` → `persist()`.

---

## 📍 App Routes / Screens

### Admin Views

```
/admin/categories
```

* Add Category
* List Categories

```
/admin/categories/:id
```

* Add/edit properties for that category
* Fields:

  * label
  * data type
  * ui type
* Options array input for dropdown

```
/admin/categories/:id/preview
```

* Render form UI using RHF

### User Views

```
/user
```

* Select category
* Go to dynamic form

```
/user/:categoryId/form
```

* Render RHF form
* On submit → save Entry to LocalStorage

```
/user/entries
```

* List stored entries

---

## 🧩 Dynamic Form Rendering

Use `React Hook Form` + `Controller`.

Map properties to UI components:

| uiType | Component                 |
| ------ | ------------------------- |
| text   | `<input type="text" />`   |
| number | `<input type="number" />` |
| toggle | `<Switch />`              |
| date   | `<input type="date" />`   |
| time   | `<input type="time" />`   |
| select | `<Select options />`      |

---

## 🎨 UI Guidelines using Tailwind + Shadcn

* Use Cards for groups
* Use Dialog for modals
* Use Select for dropdown type fields
* Buttons should be clear: Add, Save, Delete

---

## 🧪 MVP Tasks for Agent

1. Initialize project with Tailwind + Zustand.
2. Build LocalStorage persistence wrapper.
3. Implement Categories Store + screen.
4. Implement Properties Store + screen.
5. Render dynamic form from property schema.
6. Store user entries locally.
7. Render entries list.
8. Style using Tailwind.

---

## 🛠 Future Upgrade Path

Later integrate Supabase:

* Replace Categories LocalStorage → categories table
* Replace Properties LocalStorage → properties table
* Replace Entries LocalStorage → JSON column
* Add user authentication
* Add Row-Level Security

No UI changes required.

---

## ✔ Acceptance Criteria

* Admin can create category
* Admin can define schema fields
* Schema persists across refresh
* User can fill forms dynamically
* Entries saved in LocalStorage
* Entries viewable


