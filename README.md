# Form-Builder IDE Agent (React + Vite Version)

This file guides an AI coding agent to help build a **Dynamic Schema-Driven Form Builder App**.

---

## 🏗 Tech Stack

* **Frontend:** React + Vite
* **State:** Zustand
* **Forms:** React Hook Form
* **Styling:** TailwindCSS
* **Storage (temporary):** LocalStorage

No backend yet. Data persistence is local.

---

## 🎯 Core Idea

Two roles:

1. **Admin** defines a schema of fields
2. **User** fills a form generated from that schema

Categories can exist (e.g., Vehicles, Clothes, Electronics).

---

## 📌 Admin Capabilities

Admin creates fields with:

* **Property Name** (text input)
* **Property Data Type:** string | number | boolean | date | time
* **Input UI Type:** text field | date picker | time picker | switch | dropdown
* **Optional:** predefined dropdown values

Store schema like:

```json
{
  "category": "vehicle",
  "fields": [
    { "name": "brand", "type": "string", "ui": "text" },
    { "name": "wheels", "type": "number", "ui": "text" },
    { "name": "electric", "type": "boolean", "ui": "switch" }
  ]
}
```

Save this JSON in **LocalStorage**.

---

## 👤 User Capability

* Select category
* UI auto-generates form using schema
* Enter values
* Save submissions (LocalStorage list)

---

## 🗂 Storage Model (LocalStorage Keys)

* `schemas` → array of schema objects
* `entries` → values filled by users

---

## 🧱 Zustand State Needed

* `schemas` store
* `addSchema(category, fields)`
* `addFieldToSchema(category, field)`
* `entries` store
* `addEntry(category, data)`

---

## 🎨 UI Pages

### 1. Schema Builder (Admin-only)

* Select category or create new category
* Add multiple fields (React Hook Form + useFieldArray)
* Save

### 2. Form Page (User)

* Select category
* Load schema
* Render dynamic fields
* Save entry

### 3. Entries Viewer

* Show saved user entries

---

## 🚀 Libraries That Help

* `react-hook-form`
* `zustand`
* `clsx` (conditional styling)

---

## 🤖 AI Agent Tasks

Agent should be able to:

1. Generate component scaffolds
2. Build Zustand store
3. Build form generator from schema
4. Build admin form builder using `useFieldArray`
5. Map `type + ui` to correct input component
6. Save & read schemas from LocalStorage
7. Build UI with Tailwind
8. Build basic routing

---

## 🏁 Next Goal

Implement **first Admin page:**

* Add category
* Add fields
* Save schemas to LocalStorage
