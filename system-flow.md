# ADU Navi — System Flow

---

## 👤 USER PANEL

User `user1@gmail.com` se login karta hai → `/userpanel/dashboard` par aa jaata hai.

---

### Dashboard
User ka poora overview ek jagah:
- Kitne **active projects** hain
- Kitni **saved properties** hain
- Kitne **professionals** save kiye hain
- Kitne **unread law alerts** hain
- Chal rahe ADU builds ka **progress bar** (Design Phase, Permit Review, Construction, etc.)
- Latest **zoning alerts** sidebar mein

---

### My Profile
User apni personal information update karta hai:
- Full Name
- Phone Number
- Location / City
- Bio / Project Goals

> Email change nahi hoti — woh read-only hai.

---

### My ADU Projects
User apne ADU construction projects track karta hai:
- **Naya project add karo** — naam, ADU type (Detached / Attached / Garage Conversion / JADU), current status, aur progress %
- **Progress track karo** — Design Phase → Permit Review → Construction → Completed
- **Project delete karo**

---

### Property Checks
User apni property ki ADU feasibility check karta hai:
- Address daalo → system batata hai ADU ban sakta hai ya nahi
- Puraani checks history mein saved rehti hain

---

### Favorites
User pasand ki properties save karta hai:
- Property address, status (Feasible / In Review), aur tags (Detached, Solar, etc.)
- Ek jagah sab saved properties

---

### Saved Professionals
User jo professionals pasand kare unhe bookmark karta hai:
- Directory se koi bhi pro save karo
- Baad mein directly yahan se dekho

---

### Notifications
ADU law changes ke alerts:
- Koi naya law pass hua → user ko notification milti hai
- State-wise filter kar ke dekho

---

### Subscriptions
User apna plan manage karta hai:
- Abhi kaunsa plan chal raha hai (Free / Pro / Expert)
- Upgrade ka option

---

### Resources
ADU se related documents aur guides:
- Checklists download karo
- ADU planning guides

---

### Settings
- Notification preferences set karo
- Password update karo

---

### User Ka Data — Client aur Admin Side Par Kaise Dikhta Hai

**Client Side (User ko khud dikhta hai):**
- Apna dashboard → sirf apne projects, checks, favorites
- Apna profile → sirf apni info

**Admin Side (Admin ko dikhta hai):**
- Sab users ki list — naam, email, role, subscription, join date
- Kisi bhi user ki details dekho, role change karo, ya delete karo
- Agar user ne professionals save kiye ya properties check ki — woh user ke record mein hota hai

---
---

## 🛡️ ADMIN DASHBOARD

Admin `/super` URL se login karta hai → `/super/dashboard` par aa jaata hai.

---

### Dashboard (Overview)
Admin ko platform ka summary ek nazar mein:
- Total registered users
- Monitored states ki count
- Listed professionals ki count
- Dispatched law alerts
- Weekly property checker usage chart
- Recent admin activity log

---

### States & Cities
- Nayi US state add karo
- State ke andar cities add/edit/delete karo
- Har state ka ADU status set karo (Allowed / Restricted / Pending)

---

### ADU Laws
- Har state ke ADU rules manage karo
- Max size, setback rules, height limits wagera add/update karo

---

### Property Checker
- Property checker tool ka backend data manage karo
- Zoning rules aur feasibility conditions set karo

---

### Cost Library
- Har state ke liye ADU construction cost add karo
- Type (Detached / Attached / Garage), min-max size, average cost, design cost, permit cost, construction cost

---

### Professionals Directory
- Professional listings approve, edit, delete karo
- Verified badge lagao ya hatao
- Naam, role, location, contact, description manage karo

---

### Law Tracker / Alerts
- Nayi law change alert publish karo (state, title, status, impact)
- "Before" aur "After" likh ke users ko clearly batao kya badla
- Purani alerts edit ya delete karo

---

### Users Manager
- Sab registered users ki list
- Role change karo (homeowner → professional → admin)
- User delete karo
- Subscription status dekho

---

### Subscriptions
- Sab users ke subscription plans dekho
- Kaunsa user Free, Pro, ya Expert plan par hai

---

### Blog Manager
- Naye blog articles likho aur publish karo
- Purane blogs edit ya delete karo

---

### Contact Us Manager
- Users ne jo contact form bhara — sab messages yahan aate hain
- Admin padhta hai aur manage karta hai

---

### System Settings
- Site ka **theme color** change karo (poori site ka color badal jaata hai)
- **Maintenance Mode** on/off karo (on karo to poori site band, sirf admin panel chalta hai)
- Email aur SMS notification templates edit karo
- Site title aur meta description update karo

---

### Activity Logs
- Har admin action automatically record hota hai
- Kab, kya, kisne kiya — sab yahan dikhta hai
