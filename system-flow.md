# ADU Navi — Complete System Flow (Roman Urdu)
> Client ke liye poora project ka flow — components, pages, aur services ka aapas mein connection

---

## 🏗️ PROJECT KYA HAI?

**ADU Navi** ek React-based web application hai jo **Accessory Dwelling Units (ADU)** ke baare mein information deta hai — yaani wo chote ghar jo kisi property ke saath banaye jaate hain.  
Yeh platform US states ke ADU laws, costs, professionals, aur property checking ki suvidha deta hai.

**Tech Stack:**
- **Frontend:** React.js + Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Firebase (Firestore + Auth + Storage)
- **Caching:** localStorage (offline support ke liye)
- **Routing:** React Router v6

---

## 🌐 APPLICATION KE TEEN MAIN SECTIONS

```
ADU Navi
├── 1. Public Site       → Sab ke liye (Navbar + Footer ke saath)
├── 2. User Panel        → Registered users ke liye (/userpanel/*)
└── 3. Super Admin Panel → Sirf Admins ke liye (/super/*)
```

---

## 1️⃣ APPLICATION BOOT HONE KA FLOW

```
Browser mein URL open hota hai
        ↓
main.jsx → App.jsx load hota hai
        ↓
App.jsx startup par do kaam karta hai:
   ① localStorage se cached settings load karta hai (instant theme apply)
   ② Background mein Firebase Firestore se fresh data sync karta hai:
       - Settings (theme color wagera)
       - States data
       - Costs data
       - Professionals directory
       - Alerts/Laws
       - Users
       - Logs
        ↓
Agar maintenanceMode = true hai Firestore mein:
   → Sab routes band, sirf "Under Maintenance" page dikhta hai
   → Exception: /super/* aur /seed routes kaam karte hain
        ↓
Normal mode mein: React Router routes activate ho jaate hain
```

---

## 2️⃣ ROUTING KA POORA STRUCTURE

### Public Routes (MainLayout ke saath — Navbar + Footer)
| Route | Page Component | Kaam |
|-------|---------------|------|
| `/` | `Home.jsx` | Homepage |
| `/landing` | `LandingPage.jsx` | Marketing landing page |
| `/states` | `StatesPage.jsx` | Sab states ki list |
| `/state/:stateName` | `StatePage.jsx` | Kisi ek state ki detail |
| `/state/:state/city/:cityName` | `CityPage.jsx` | City level ADU info |
| `/property-checker` | `PropertyCheckerPage.jsx` | Property check karo |
| `/how-to-build` | `HowToBuildPage.jsx` | ADU banane ka guide |
| `/directory` | `DirectoryPage.jsx` | Professionals ki list |
| `/costs` | `CostLibraryPage.jsx` | Cost estimates |
| `/law-tracker` | `LawTrackerPage.jsx` | ADU laws track karo |
| `/alerts` | `AlertsPage.jsx` | Law changes ke alerts |
| `/blog` | `BlogPage.jsx` | Blog articles |
| `/about` | `AboutPage.jsx` | About us |
| `/contact` | `ContactPage.jsx` | Contact form |
| `/faq` | `FAQPage.jsx` | Aksar puche gaye sawalat |
| `/privacy` | `PrivacyPage.jsx` | Privacy policy |
| `/terms` | `TermsPage.jsx` | Terms of service |
| `/disclaimer` | `DisclaimerPage.jsx` | Disclaimer |

### Auth Routes
| Route | Component | Kaam |
|-------|-----------|------|
| `/login` | `Login.jsx` | User login |
| `/register` | `Register.jsx` | Naya account banao |
| `/forgot-password` | `ForgotPassword.jsx` | Password reset |

### User Panel Routes (`/userpanel/*`)
| Route | Page | Kaam |
|-------|------|------|
| `/userpanel/dashboard` | `UserDashboard` | User ka overview |
| `/userpanel/profile` | `Profile` | Profile edit karo |
| `/userpanel/projects` | `Projects` | ADU projects track karo |
| `/userpanel/checks` | `Checks` | Property checks history |
| `/userpanel/favorites` | `Favorites` | Saved properties |
| `/userpanel/notifications` | `Notifications` | Alerts/notifications |
| `/userpanel/subscriptions` | `Subscriptions` | Plan manage karo |
| `/userpanel/resources` | `Resources` | Documents/resources |
| `/userpanel/professionals` | `Professionals` | Saved pros |
| `/userpanel/settings` | `Settings` | Account settings |

### Super Admin Panel Routes (`/super/*`)
| Route | Page | Kaam |
|-------|------|------|
| `/super` | `SuperLoginPage` | Admin login gateway |
| `/super/dashboard` | `AdminDashboard` | Admin overview |
| `/super/states` | `StatesCities` | States/Cities manage karo |
| `/super/laws` | `ADULaws` | ADU laws edit karo |
| `/super/checker` | `PropertyChecker` | Property checker manage |
| `/super/costs` | `CostLibrary` | Cost data manage karo |
| `/super/directory` | `Professionals` | Pro listings manage karo |
| `/super/alerts` | `LawTracker` | Law alerts manage karo |
| `/super/users` | `UsersManager` | Users manage karo |
| `/super/subscriptions` | `Subscriptions` | Subscriptions dekho |
| `/super/blogs` | `BlogManager` | Blogs likhna/edit karna |
| `/super/settings` | `SystemSettings` | System settings |
| `/super/logs` | `ActivityLogs` | Admin activity logs |
| `/super/contactus` | `ContactUsManager` | Contact messages dekho |

---

## 3️⃣ AUTHENTICATION (LOGIN/SIGNUP) KA FLOW

```
User Login karta hai (email + password)
        ↓
AuthContext.jsx → login() function call hota hai
        ↓
Special check: kya email "dev@gmail.com" hai?
   → Haan: Aaj ki date password se match karo (developer mode)
   → Nahi: Firestore se user fetch karo
        ↓
Firestore /users/{email} document se profile fetch
        ↓
Password verify hota hai (Firestore mein stored hai)
        ↓
Kamiyabi par:
   - currentUser state mein user save hota hai
   - localStorage mein email save hoti hai ("adu-hub-user-email")
   - User panel mein redirect hota hai
        ↓
Logout par:
   - currentUser = null
   - localStorage se email remove hoti hai
```

### Session Restore (Page Reload par)
```
Page reload hoti hai
        ↓
AuthContext useEffect chalti hai
        ↓
localStorage mein "adu-hub-user-email" dhoondti hai
        ↓
Mili to: Firestore se profile dubara fetch karo
   → Mila: currentUser set karo
   → Nahi mila: localStorage clean karo
        ↓
Loading = false → App render hona shuru
```

### User Roles
| Role | Access Level |
|------|-------------|
| `homeowner` | User panel access |
| `professional` | User panel + leads management |
| `investor` | User panel access |
| `admin` | Super admin panel |
| `superAdmin` | Full super admin panel |

---

## 4️⃣ DATA FLOW — FIREBASE + LOCALSTORAGE

Yeh application ek **smart caching system** use karti hai:

```
                    ┌─────────────────┐
                    │   FIREBASE       │
                    │   FIRESTORE      │
                    │  (Cloud Database)│
                    └────────┬────────┘
                             │ App boot par sync
                             ↓
                    ┌─────────────────┐
                    │  localStorage   │
                    │  (Browser Cache)│
                    └────────┬────────┘
                             │ Instant read
                             ↓
                    ┌─────────────────┐
                    │   dbService.js  │
                    │  (CRUD wrapper) │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ↓                             ↓
     ┌────────────────┐           ┌──────────────────┐
     │  Public Pages  │           │  Admin Panel      │
     │  User Panel    │           │  (read + write)   │
     └────────────────┘           └──────────────────┘
```

**dbService.js ke main collections:**
- `adu-db-states` → States aur cities ka data
- `adu-db-costs` → Cost estimates
- `adu-db-directory` → Professionals list
- `adu-db-alerts` → Law alerts
- `adu-db-users` → Users list
- `adu-db-logs` → Admin activity logs
- `adu-db-settings` → Site settings (theme, maintenance mode, etc.)

**Data Update ka tariqa (Admin se):**
```
Admin kuch edit karta hai
        ↓
dbService.js → localStorage update hota hai (instant UI update)
        ↓
Firebase Firestore mein bhi async write ho jaata hai (background)
        ↓
Agla user jo site open kare, fresh data mile
```

---

## 5️⃣ COMPONENT ARCHITECTURE

### MainLayout Structure
```
MainLayout.jsx
├── Navbar.jsx      ← Top navigation bar (har public page par)
├── [Page Content]  ← Jo bhi page hai
└── Footer.jsx      ← Bottom footer (har public page par)
```

### Home Page Components
```
Home.jsx
├── Hero.jsx          ← Main banner/hero section
├── ValueProp.jsx     ← ADU ke faide (value propositions)
├── AudienceSection.jsx ← Target audience section
└── StateGrid.jsx     ← States ki grid listing
```

### User Panel Structure
```
UserRoutes.jsx
├── Login.jsx / Register.jsx / ForgotPassword.jsx  ← Auth pages
└── UserLayout.jsx  ← Sidebar + Header wrapper
    ├── UserDashboard
    ├── Profile
    ├── Projects
    ├── Checks
    ├── Favorites
    ├── Notifications
    ├── Subscriptions
    ├── Resources
    ├── Professionals
    └── Settings
```

### Super Admin Structure
```
SuperApp.jsx
├── Security Gate → Login check → Role check
├── AdminSidebar.jsx  ← Navigation sidebar
└── [Admin Pages]
    ├── AdminDashboard
    ├── StatesCities
    ├── ADULaws
    ├── PropertyChecker
    ├── CostLibrary
    ├── Professionals
    ├── LawTracker
    ├── UsersManager
    ├── Subscriptions
    ├── BlogManager
    ├── SystemSettings
    ├── ActivityLogs
    └── ContactUsManager
```

---

## 6️⃣ COMPLETE CONNECTION DIAGRAM

```
┌──────────────────────────────────────────────────────────────┐
│                         FIREBASE                              │
│   Firestore Collections:                                      │
│   users | states | costs | professionals | alerts |           │
│   logs | settings | aduLaws | propertyChecks |               │
│   notifications | subscriptions | contactus                   │
└──────────────────────┬───────────────────────────────────────┘
                       │ sync (boot time + on write)
                       ↕
┌──────────────────────────────────────────────────────────────┐
│                    LOCALSTORAGE (Cache)                       │
│   adu-db-states | adu-db-costs | adu-db-directory |          │
│   adu-db-alerts | adu-db-users | adu-db-logs |               │
│   adu-db-settings                                            │
└──────────────────────┬───────────────────────────────────────┘
                       │ read/write
                       ↕
┌──────────────────────────────────────────────────────────────┐
│               dbService.js (Service Layer)                    │
│   getStates() | getUsers() | getDirectory() | getAlerts() |  │
│   getCosts() | getSettings() | getLogs() | addLog() etc.     │
└───────┬───────────────────────────────┬──────────────────────┘
        │                               │
        ↓                               ↓
┌───────────────┐               ┌───────────────┐
│  AuthContext  │               │   App.jsx      │
│  (useAuth)    │               │   (Root)       │
│               │               │                │
│  currentUser  │               │  Routing +     │
│  login()      │               │  Theme Inject  │
│  signup()     │               │  Maintenance   │
│  logout()     │               │  Mode Check    │
└───────┬───────┘               └───────┬────────┘
        │                               │
        ↓                               ↓
┌───────────────────────────────────────────────────────────┐
│                    React Router                            │
│                                                           │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Public Routes  │  │  User Panel  │  │  Super Admin│ │
│  │  /  /states     │  │  /userpanel/*│  │  /super/*   │ │
│  │  /property-     │  │              │  │             │ │
│  │  checker etc.   │  │  Protected   │  │  Admin Only │ │
│  │                 │  │  (Auth req.) │  │  (Role req.)│ │
│  └────────┬────────┘  └──────┬───────┘  └──────┬──────┘ │
│           │                  │                  │        │
└───────────┼──────────────────┼──────────────────┼────────┘
            ↓                  ↓                  ↓
    ┌────────────┐    ┌─────────────────┐  ┌─────────────────┐
    │MainLayout  │    │  UserLayout     │  │  SuperApp       │
    │            │    │                 │  │  (AdminSidebar) │
    │ Navbar     │    │  Sidebar +      │  │                 │
    │ [Content]  │    │  Dashboard etc. │  │  13 Admin Pages │
    │ Footer     │    │  10 User Pages  │  │                 │
    └────────────┘    └─────────────────┘  └─────────────────┘
```

---

## 7️⃣ USER JOURNEY (Ek Normal User Ka Flow)

```
1. User pehli baar site kholta hai
   → Home page dikhta hai (Hero + ValueProp + StateGrid)
   
2. User koi state select karta hai (e.g., California)
   → /state/california → StatePage
   → dbService se state data load hota hai (localStorage/Firestore)
   
3. User koi city select karta hai
   → /state/california/city/los-angeles → CityPage
   → City-specific ADU rules dikhte hain
   
4. User property check karna chahta hai
   → /property-checker → PropertyCheckerPage
   → Address dalo, ADU feasibility check karo
   
5. User professional dhoondna chahta hai
   → /directory → DirectoryPage
   → Filter by location, role, tags
   
6. User register karta hai
   → /register → Register.jsx
   → Firebase Firestore mein account banta hai
   → Auto-login + /userpanel/dashboard redirect
   
7. Logged-in user apna dashboard use karta hai
   → Projects track kare, favorites save kare
   → Notifications dekhe, settings update kare
```

---

## 8️⃣ ADMIN KA FLOW

```
1. Admin /super URL par jaata hai
   → SuperLoginPage → email/password daalta hai
   
2. AuthContext verify karta hai:
   → Firestore se user fetch → role check
   → role === 'admin' ya 'superAdmin'? → Panel access
   
3. SuperApp.jsx render hota hai:
   → AdminSidebar + Header
   → 13 management pages available
   
4. Admin kuch update karta hai (e.g., naya state add)
   → StatesCities page → form submit
   → dbService.addState() call hota hai
   → localStorage update (instant)
   → Firebase Firestore mein bhi save (background)
   
5. Next user jo site kholta hai:
   → App boot par Firestore sync
   → Fresh data milta hai
   
6. Admin Activity Logs:
   → Har admin action automatically log hota hai
   → /super/logs mein dekh sakte hain
```

---

## 9️⃣ THEME SYSTEM

```
Firebase Firestore → settings.themeColor (hex color)
        ↓
App.jsx boot par load karta hai
        ↓
hexToHSL() function → hex ko HSL mein convert karta hai
        ↓
CSS variables inject hote hain dynamically:
   --color-secondary
   --color-emerald-50 to 900
        ↓
Poori site ka color scheme change ho jaata hai
        ↓
Admin /super/settings se koi bhi color set kar sakta hai
```

---

## 🔑 KEY CONFIG FILES

| File | Kaam |
|------|------|
| `src/config/routes.js` | Sab routes ke URL paths |
| `src/config/collections.js` | Firebase Firestore collection names |
| `src/config/roles.js` | User roles aur admin check |
| `src/config/firebaseConfig.js` | Firebase project credentials |
| `src/config/navigation.js` | Navbar/Sidebar links |
| `src/config/features.js` | Feature flags |
| `src/config/notifications.js` | Notification settings |

---

## 📊 FIRESTORE COLLECTIONS SUMMARY

| Collection | Kya store hota hai |
|------------|-------------------|
| `users` | User accounts (email as doc ID) |
| `states` | US states aur cities data |
| `aduLaws` | ADU rules per state |
| `professionals` | Directory listings |
| `costs` | Cost estimates per state/type |
| `alerts` | Law change alerts |
| `propertyChecks` | Property feasibility checks |
| `notifications` | User notifications |
| `subscriptions` | User subscription plans |
| `contactus` | Contact form messages |
| `settings` | Global site settings |
| `logs` | Admin activity logs |

---

## ⚡ SPECIAL FEATURES

### Maintenance Mode
- Admin `settings.maintenanceMode = true` kar de → poori site band
- Sirf `/super/*` aur `/seed` accessible rehte hain

### Developer Mode
- Email: `dev@gmail.com` → Password: aaj ki date (1-31)
- Full superAdmin access bina Firestore account ke

### Offline Support
- localStorage mein sab data cached rehta hai
- Slow internet par bhi app kaam karta hai
- Firebase sync background mein hota hai

### Database Seeder
- `/seed` route → development mein mock data inject karne ke liye

---

*Yeh document ADU Navi ka complete technical flow describe karta hai — client presentation ke liye tayyar.*
