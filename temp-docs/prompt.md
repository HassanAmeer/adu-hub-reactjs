Create a modern, scalable, and highly professional **React.js web application UI/UX design** for a platform called:

👉 **“ADU Hub – The All-in-One ADU Platform”**

This platform is focused ONLY on **design (UI/UX)** — no backend logic required — but structure everything as if it will scale nationwide.

---

## 🎯 DESIGN GOAL

Design a **clean, authoritative, trustworthy, and data-rich platform** that helps users understand:

* ADU laws
* Building feasibility
* Costs
* Professionals

The design must feel like a mix of:

* Government-level trust (official, accurate)
* Startup-level usability (modern, smooth UX)

---

## 🎨 COLOR THEME (IMPORTANT)

Use a **professional, trust-based palette**:

* Primary: `#0F172A` (Deep Navy – authority & trust)
* Secondary: `#0EA5E9` (Sky Blue – clarity & tech feel)
* Accent: `#22C55E` (Green – success/allowed states)
* Warning: `#F59E0B` (Amber – conditional rules)
* Danger: `#EF4444` (Red – prohibited)
* Background: `#F8FAFC` (Light gray/white)
* Cards: `#FFFFFF`
* Borders: `#E2E8F0`

Typography:

* Headings: Inter / Poppins (bold, modern)
* Body: Inter (clean readability)

---

## 🧱 TECH STACK (FRONTEND)

* React.js (Vite or Next.js preferred)
* Tailwind CSS (for fast UI)
* Component-based architecture
* Responsive design (mobile-first)
* Use reusable UI components

---

## 📄 COMPLETE PAGE STRUCTURE (A → Z)

### 1. Landing Page (`/`)

Sections:

* Hero (search bar: “Enter your address”)
* Value proposition (3–4 cards)
* “Explore by State” map/grid
* How it works (steps)
* Featured cities
* CTA: “Check Your Property”

---

### 2. State Page (`/state/:stateName`)

Example: `/california`

Sections:

* Overview (Allowed / Conditional / Prohibited badge)
* Key ADU rules (cards/grid):

  * Size
  * Height
  * Parking
  * Owner occupancy
* Law timeline (vertical timeline UI)
* Cities list

---

### 3. City Page (`/state/:state/city/:cityName`)

Example: `/california/san-diego`

Sections:

* Local ADU status badge
* Zoning overlays (chips/tags UI)
* Detailed rules table
* Permit timeline
* Constraints alerts (warning cards)

---

### 4. Property Checker Tool (`/property-checker`)

UI only (no backend):

Inputs:

* Address
* Lot size
* Zoning (dropdown)
* Existing structures

Output (mock UI):

* ✅ Allowed / ⚠ Conditional / ❌ Not Allowed
* Max ADU size
* Estimated cost
* Difficulty level (Easy / Medium / Hard)

---

### 5. “How to Build” Guide (`/how-to-build`)

Step-by-step UI with progress tracker:

Steps:

1. Feasibility
2. Design
3. Permit
4. Construction
5. Inspection

Each step:

* Checklist UI
* Timeline
* Common mistakes

---

### 6. Professionals Directory (`/directory`)

Filters sidebar:

* State
* City
* Role (Architect, Builder, etc.)
* Budget

Cards:

* Profile image
* Rating
* Tags (Detached / Conversion)

---

### 7. Cost Library (`/costs`)

Sections:

* Cost breakdown cards:

  * Design
  * Permits
  * Construction
* Charts (bar/line UI)
* Filters:

  * State
  * ADU type

---

### 8. Law Tracker (`/law-tracker`)

* Timeline UI
* Before vs After comparison cards
* Subscription CTA

---

### 9. Alerts & Subscription Page (`/alerts`)

* Select state/city
* Toggle notifications UI
* Email input

---

### 10. Auth Pages

* `/login`
* `/signup`

Minimal clean design:

* Split screen layout
* Illustration + form

---

### 11. Dashboard (Optional UI) (`/dashboard`)

* Saved locations
* Alerts
* Property checks

---

## 🧩 COMPONENTS (REUSABLE)

Design reusable components:

* Navbar (sticky, clean)
* Sidebar filters
* Cards (info, stats, alerts)
* Status badges (Allowed / Conditional / Prohibited)
* Timeline component
* Stepper component
* Table (rules)
* Modal
* Search input (with autocomplete UI)
* Map placeholder UI

---

## 🧭 UX REQUIREMENTS

* Extremely clean spacing (8px grid system)
* Clear hierarchy
* Icons (Heroicons / Lucide)
* Smooth hover effects
* Loading skeletons
* Empty states

---

## 📱 RESPONSIVENESS

* Mobile-first
* Tablet optimized
* Desktop grid layout

---

## ⚡ DESIGN STYLE

* Minimal but information-rich
* Dashboard-like clarity
* Soft shadows
* Rounded corners (xl)
* No clutter

---

## 🧠 IMPORTANT DETAILS

* Use visual indicators:

  * Green = Allowed
  * Yellow = Conditional
  * Red = Restricted
* Avoid heavy text blocks → use cards, bullets
* Make complex legal info feel SIMPLE

---

## 📦 FINAL OUTPUT EXPECTATION

* Fully structured React component layout
* Clean folder structure:

  * /components
  * /pages
  * /layouts
  * /data (mock)
* Each page fully designed (UI only)
* Use dummy/mock data where needed

---

## 🚀 GOAL

Design a platform that feels like:
👉 “The Google Maps + Stripe Dashboard of ADU laws”

It should look:

* Premium
* Scalable
* Investor-ready
* SaaS-level quality
