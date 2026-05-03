# ADU Hub – Complete Website Prompt (React JS Only)

## ⚠️ Important Rules
- Sirf React JS me banana hai — koi backend, koi API nahi
- Sab data mock/static hoga (JSON files ya hardcoded arrays)
- Koi cheez aise nahi honi chahiye jo client ke document me mentioned nahi
- Design modern, premium aur responsive honi chahiye (dark mode support)
- Routing ke liye React Router DOM use karein
- Animations ke liye Framer Motion use karein
- Icons ke liye Lucide React use karein

---

## 🎯 Project Name
**ADU Hub** — The All-in-One ADU Platform

### Tagline:
> "Can I build an ADU on my property, how do I do it legally, and who can help me?"

---

## 📄 Pages Required (Client Document ke Mutabiq)

### 1. Home Page (`/`)
- Hero section with headline: "Everything ADUs — All in One Place"
- Sub-headline explaining the gap (fragmented city PDFs vs. one authoritative hub)
- Competitive edge section (4–5 cards):
  - ✅ Verified Laws & Codes
  - ✅ Location-Specific Rules
  - ✅ Practical Building Guidance
  - ✅ Vetted Professionals
  - ✅ Real Cost & Feasibility Clarity
- "Who This Serves" section (audience cards):
  - Homeowners, Real Estate Investors, Architects & Designers, Builders, Realtors, City Planners, Lenders
- CTA Section: "Start Your ADU Journey"

---

### 2. State-by-State ADU Law Database (`/states`)
**URL Structure:** `/state/:stateName` → `/state/:stateName/city/:cityName/adu-rules`

Each **State Page** must show:
- ADU Legality Status badge: `Allowed` / `Restricted` / `Prohibited`
- Owner-Occupancy Rules
- Max Size (sq ft)
- Height Limit
- Setbacks (Rear/Side)
- Parking Requirements
- Utility Connection Rules
- Fire & Life Safety Requirements
- Recent Law Updates (timeline/list)
- Links to major city sub-pages

Each **City Page** must show:
- Zoning Overlays
- Coastal / Historic / HOA Overlays
- Local Amendments to State Law
- Permit Processing Time (estimated days)
- Back to State button

**MVP States to include (mock data):** California, Oregon, Washington

---

### 3. Property Checker (`/property-checker`)
Client ne kaha: "Can I Build?" tool — high value feature

User input form:
- Address (text input)
- Lot Size (dropdown: <5,000 / 5,000–7,500 / 7,500–10,000 / 10,000+ sq ft)
- Zoning (dropdown: R1 / R2 / R3 / Mixed Use / Commercial)
- Existing Structures (checkboxes: Main House / Garage / Pool / Other)

Output (mock result card):
- ADU Allowed? → `Yes` / `Conditional` / `No` badge
- Max ADU Size (sq ft)
- Likely Constraints list
- Estimated Approval Difficulty (Easy / Medium / Hard)
- Rough Cost Range (e.g., $180k – $320k)

**Note:** Yeh sab mock logic se hoga — koi real API nahi

---

### 4. How to Build an ADU (`/how-to-build`)
Client ne kaha: Step-by-step guided roadmap

7 Steps with icons, progress indicator, descriptions:
1. Feasibility Check
2. Survey & Site Constraints
3. Design Options (Garage / Detached / Conversion)
4. Plan Submittal
5. Permit Review
6. Construction
7. Final Inspection & Occupancy

Each step section includes:
- Checklist items
- Typical Timeline (e.g., "2–4 weeks")
- Common Rejection Reasons

---

### 5. Plans, Designers & Contractors Directory (`/directory`)
Client ne kaha: Curated listings by location

Filter Bar:
- State filter
- City filter
- Type filter: Architect / Designer / Engineer / Builder / Prefab Company
- ADU Type: Detached / Conversion / Garage
- Budget Range: Under $100k / $100k–$200k / $200k+

Listing Cards (mock data, min 12 entries):
- Professional Name
- Type badge
- Location
- Specialization
- Rating (stars)
- "View Profile" button

---

### 6. ADU Cost Library (`/costs`)
Client ne kaha: Realistic numbers broken down

Filters:
- State
- Area Type: Urban / Suburban
- ADU Type: Detached / Attached / Garage Conversion

Cost Breakdown Table/Cards:
- Design Fees: range
- Permit Costs: range
- Construction Cost by Type
- Utility Upgrades
- Impact Fees (where applicable)

Visual chart (bar or simple CSS-based) showing cost comparison by state.

---

### 7. Law Change Tracker & Alerts (`/law-tracker`)
Client ne kaha: Subscribe & get notified when ADU laws change

Page includes:
- Timeline/feed of recent law changes (mock data, min 5 entries)
- Each entry: State, City, Date, "Before vs After" summary
- Subscribe form: Email + Select State/City → "Subscribe" button (mock, no real email)
- Tag filters: California / Oregon / Washington

---

### 8. Login & Signup Pages (`/login`, `/signup`)
Simple auth UI (no real auth needed — mock state only):
- Login: Email + Password + "Sign In" button
- Signup: Name + Email + Password + "Create Account" button
- Use React Context for mock auth state

---

### 9. Dashboard (`/dashboard`)
Visible only after mock login

Dashboard shows:
- User's saved properties
- Subscribed law alerts (mock list)
- Recent activity (mock)
- Quick links to Property Checker, Directory, Cost Library

---

## ❌ Cheezein Jo Include NAHI Karni (Client Document Me Nahi Hain)
- Koi mining/crypto related content
- Koi unrelated industry data
- Blog section (not mentioned by client)
- News feed (not mentioned)
- Social media integration
- Payment/checkout flow (monetization Phase 2 hai)
- Admin panel
- Real backend or database

---

## 🎨 Design System (Detailed)

> **Goal:** Website ka design premium, modern aur trustworthy lagna chahiye —
> jaise kisi SaaS product ka hota hai (Notion, Linear, Stripe jesi feel).

---

### 🎨 Color Palette

#### Primary Colors:
| Name | Hex | Use |
|------|-----|-----|
| Deep Navy | `#0F172A` | Main background, Navbar, Hero |
| Slate Dark | `#1E293B` | Card backgrounds, section bg |
| Slate Mid | `#334155` | Borders, dividers |

#### Brand / Accent Colors:
| Name | Hex | Use |
|------|-----|-----|
| Emerald (Primary CTA) | `#059669` | Buttons, links, badges (Allowed) |
| Emerald Light | `#10B981` | Hover states, highlights |
| Emerald Pale | `#D1FAE5` | Light badges, success backgrounds |
| Amber (Warning) | `#F59E0B` | Restricted badge, warnings |
| Amber Pale | `#FEF3C7` | Light warning backgrounds |
| Red (Danger) | `#EF4444` | Prohibited badge, errors |
| Red Pale | `#FEE2E2` | Light error backgrounds |

#### Neutral / Text Colors:
| Name | Hex | Use |
|------|-----|-----|
| White | `#FFFFFF` | Text on dark backgrounds |
| Slate 100 | `#F1F5F9` | Page background (light sections) |
| Slate 200 | `#E2E8F0` | Card borders |
| Slate 400 | `#94A3B8` | Muted text, placeholders |
| Slate 600 | `#475569` | Secondary body text |
| Slate 800 | `#1E293B` | Primary body text |

#### CSS Variables (index.css mein define karein):
```css
:root {
  --color-primary: #0F172A;
  --color-secondary: #059669;
  --color-accent: #F59E0B;
  --color-danger: #EF4444;
  --color-bg: #F8FAFC;
  --color-text: #1E293B;
  --color-muted: #94A3B8;
  --color-border: #E2E8F0;
  --color-card: #FFFFFF;
  --color-card-dark: #1E293B;
}
```

---

### 🔤 Typography

**Google Font:** `Inter` — import karein index.html ya CSS mein:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

#### Font Scale:
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 56–72px | 800 (ExtraBold) | 1.1 |
| H2 (Section titles) | 36–48px | 700 (Bold) | 1.2 |
| H3 (Card titles) | 24–28px | 600 (SemiBold) | 1.3 |
| H4 (Sub-headings) | 18–20px | 600 | 1.4 |
| Body (Regular) | 16px | 400 | 1.6 |
| Body Small | 14px | 400 | 1.5 |
| Caption / Label | 12px | 500 | 1.4 |
| Button Text | 14–16px | 600 | 1 |

#### Typography Rules:
- Headings pe `letter-spacing: -0.02em` lagaein (tight feel)
- Dark sections pe heading color: `#FFFFFF`
- Light sections pe heading color: `#0F172A`
- Muted text: `#94A3B8`

---

### 📐 Spacing & Layout

#### Grid System:
- Max container width: `1280px`
- Side padding: `1rem` (mobile) → `2rem` (tablet) → `4rem` (desktop)
- Section vertical padding: `80px` (mobile) → `120px` (desktop)

#### Spacing Scale (use consistently):
```
4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 80px / 120px
```

#### Border Radius:
| Element | Radius |
|---------|--------|
| Buttons | `12px` |
| Cards | `20px` |
| Large containers | `32px` |
| Badges/pills | `999px` (full round) |
| Input fields | `10px` |

---

### 🧩 Component Design Specs

#### 1. Navbar
- Background: `#0F172A` (always dark)
- Logo: White text, bold
- Nav links: `#94A3B8` → hover: `#FFFFFF` + underline animation
- CTA Button: Emerald (`#059669`) fill, white text
- Mobile: Hamburger icon, slide-down menu with backdrop blur
- Sticky on scroll with `backdrop-filter: blur(20px)` + subtle border bottom

#### 2. Buttons
```
Primary Button:
  bg: #059669 | text: white | padding: 14px 28px
  border-radius: 12px | font-weight: 600
  hover: bg #10B981, translateY(-2px), shadow-lg
  transition: all 200ms ease

Secondary Button:
  bg: transparent | border: 2px solid #059669
  text: #059669 | same padding/radius
  hover: bg #059669, text white

Ghost Button:
  bg: transparent | text: #94A3B8
  hover: text white
```

#### 3. Cards
```
Light Card:
  bg: #FFFFFF | border: 1px solid #E2E8F0
  border-radius: 20px | padding: 28px
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07)
  hover: translateY(-4px), shadow-xl, border-color: #059669/30

Dark Card:
  bg: #1E293B | border: 1px solid #334155
  border-radius: 20px | padding: 28px
  hover: border-color: #059669/50
```

#### 4. Status Badges
```
Allowed:   bg #D1FAE5 | text #065F46 | border #6EE7B7
Restricted: bg #FEF3C7 | text #92400E | border #FCD34D
Prohibited: bg #FEE2E2 | text #991B1B | border #FCA5A5

font-size: 12px | font-weight: 600 | padding: 4px 12px
border-radius: 999px | letter-spacing: 0.05em | uppercase
```

#### 5. Input Fields / Forms
```
border: 1.5px solid #E2E8F0
border-radius: 10px | padding: 12px 16px
font-size: 15px | color: #1E293B
background: #FFFFFF
focus: border-color #059669, box-shadow 0 0 0 3px #059669/20
placeholder: color #94A3B8
```

#### 6. Footer
- Background: `#0F172A`
- 4-column grid: Logo+tagline | Pages | Resources | Newsletter
- Bottom bar: copyright + links
- Text color: `#94A3B8` → hover `#FFFFFF`

---

### ✨ Animations & Micro-interactions

**Library:** Framer Motion

#### Page Load Animations:
```jsx
// Har page wrap karein:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

#### Stagger Children (cards ke liye):
```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
}
```

#### Scroll Animations (sections ke liye):
```jsx
// whileInView use karein:
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

#### Hover Micro-animations:
- Cards: `scale(1.02)` + shadow increase (200ms)
- Buttons: `translateY(-2px)` + shadow (150ms)
- Icons: `rotate(10deg)` ya `scale(1.1)` (150ms)
- Nav links: underline slide in from left

#### Number Counter Animation (stats section):
- Use `useMotionValue` + `useSpring` for counting numbers up on scroll

---

### 🖼️ Section-Level Design Patterns

#### Hero Section (Home):
- Background: Dark navy (`#0F172A`) with animated gradient blob
- Floating glassmorphism card as visual element (right side)
- Large H1 (72px), subtitle (20px, muted), 2 CTA buttons
- Animated badge at top: "🏠 Trusted by 50,000+ Homeowners"
- Subtle grid/dot pattern overlay on background

#### Feature Cards Section:
- 3-column grid (desktop) → 1-column (mobile)
- Each card: icon (colored bg circle), title, description
- Alternating light/dark card style

#### Stats Bar:
- Full-width dark strip between sections
- 4 numbers: "50+ States", "10,000+ Laws Tracked", "500+ Professionals", "95% Accuracy"
- Animated count-up on scroll

#### Testimonials (optional — can be mock):
- Card carousel style
- Avatar + name + role + quote
- Star rating

#### Section Backgrounds — Alternating Pattern:
```
Section 1: Light (#F8FAFC)
Section 2: Dark (#0F172A)
Section 3: Light (#FFFFFF)
Section 4: Emerald tint (#F0FDF4)
Section 5: Dark (#0F172A)
```

---

### 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | 1 column, stacked |
| Tablet | 640–1024px | 2 columns |
| Desktop | > 1024px | 3–4 columns |

- Navbar mobile pe hamburger menu
- Cards mobile pe full width
- Hero H1 mobile pe 36px
- Padding mobile pe 16px side

---

### 🌙 Dark/Light Mode (Optional Enhancement)
- Default: Light mode
- Dark mode toggle in navbar
- Use CSS variables for all colors so switching is easy
- `localStorage` mein preference save karein

---

## 📁 Recommended Folder Structure

```
src/
├── components/
│   ├── common/         # Navbar, Footer, Badge, Card
│   ├── home/           # Hero, ValueProp, StateGrid, AudienceSection
│   ├── shared/         # SearchBar, FilterBar, StepCard
├── pages/
│   ├── Home.jsx
│   ├── StatePage.jsx
│   ├── CityPage.jsx
│   ├── PropertyCheckerPage.jsx
│   ├── HowToBuildPage.jsx
│   ├── DirectoryPage.jsx
│   ├── CostLibraryPage.jsx
│   ├── LawTrackerPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── DashboardPage.jsx
├── data/
│   ├── statesData.js   # Mock state law data
│   ├── citiesData.js   # Mock city data
│   ├── directoryData.js
│   ├── costsData.js
│   └── lawChanges.js
├── context/
│   └── AuthContext.jsx # Mock auth state
├── layouts/
│   └── MainLayout.jsx  # Navbar + Footer wrapper
```

---

## ✅ Kya Check Karna Hai Build Ke Baad

- [ ] Har page client document ke sections se match karta ho
- [ ] Koi mining/unrelated content nahi
- [ ] Property Checker kaam karta ho (mock output)
- [ ] Directory filters kaam karte hon
- [ ] Law Tracker timeline dikhti ho
- [ ] Har state page me sab required fields hon
- [ ] City page properly link ho state page se
- [ ] Login/Signup mock state kaam kare
- [ ] Dashboard sirf login ke baad accessible ho
- [ ] Mobile responsive ho
