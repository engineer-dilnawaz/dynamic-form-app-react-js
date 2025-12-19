## 🏗 Project Goal

Build a **Next.js + Supabase application** where:

* **Admin users can create categories**
  (e.g., Vehicles, Clothes, Electronics)
* **Admin defines dynamic form schema**
  by adding multiple properties:

  * Property Name (string)
  * Data Type: `string | number | boolean | date | time`
  * UI Type: `text_input | date_picker | time_picker | toggle | dropdown`
  * Options (for dropdown values, optional)
* **Users can fill forms based on the schema**
* Each user submission is stored as structured JSON

No custom backend — use **Supabase DB, Auth, and RLS**.

---

## 🧱 Tech Stack

* **Next.js App Router**
* **Supabase JS Client**
* **React Hook Form**
* **Shadcn/UI**
* **TypeScript**
* **Zustand (optional)**
* **TailwindCSS**

---

## 👥 User Roles

### Admin:

* Create categories
* Add properties to categories
* Edit or reorder fields
* Preview form
* Publish schema

### End User:

* Select category
* Auto-render form
* Submit data
* View submissions

---

## 🗄 Database Schema (Supabase)

### `categories`

| column     | type           |
| ---------- | -------------- |
| id (pk)    | uuid           |
| name       | text           |
| created_by | uuid (FK user) |
| created_at | timestamp      |

### `properties`

| column      | type    |
| ----------- | ------- |
| id (pk)     | uuid    |
| category_id | uuid FK |
| label       | text    |
| data_type   | text    |
| ui_type     | text    |
| options     | jsonb   |
| order_index | int     |

### `entries`

| column      | type      |
| ----------- | --------- |
| id (pk)     | uuid      |
| category_id | uuid      |
| user_id     | uuid      |
| values      | jsonb     |
| created_at  | timestamp |

---

## 🔐 Supabase Auth Rules

* Admin role stored in `auth.users`.
* Only Admins can:

  * insert into `categories`
  * insert/update/delete `properties`
* All logged-in users can insert into `entries`
* Users can only view their own entries

RLS sample policy:

```
(using auth.role() = 'admin')
```

---

## 🖥 Pages to Build

### `/login`

* Authentication
* Supabase Auth UI

### `/admin/categories`

* List categories
* Add Category Modal

### `/admin/categories/[id]`

* Manage properties UI
* Add property
* Reorder list

### `/admin/categories/[id]/preview`

* Render form preview

### `/user`

* Choose Category
* Load dynamic form
* Submit

### `/user/entries`

* List user submissions

---

## 🧩 Dynamic Form Rules

Rendering logic based on `ui_type`:

| ui_type     | Component     |
| ----------- | ------------- |
| text_input  | `<input />`   |
| date_picker | date selector |
| time_picker | time selector |
| toggle      | `<Switch />`  |
| dropdown    | `<Select />`  |

Use **React Hook Form + Controller**.

---

## 📦 State Management

Optional global store:

```
zustand/categories-store
zustand/user-store
```

---

## 🧪 MVP Tasks for Agent

1. Initialize Next.js + Supabase.
2. Add Auth page.
3. Create DB tables via SQL migration.
4. Implement Admin Category CRUD.
5. Implement Admin Property Builder UI.
6. Render User Dynamic Form based on schema.
7. Submit JSON values.
8. Display entries list.

---

## 🛠 Future Enhancements

* Drag-and-drop ordering
* Default values
* Templates
* Export schema JSON
* Public sharing
* Mobile app (React Native)

---

## 📝 Notes for Agent

* Prioritize clean TypeScript types.
* Use server actions for secure DB ops.
* Use async/await everywhere.
* UI first → backend config after.
* Follow atomic commits.

---

## ✔ Acceptance Criteria

* Admin can define any schema
* User form updates dynamically
* Data saved properly in Supabase
* Role protection is enforced

---


