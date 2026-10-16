# 💳 Stripe Integration Guide (Sandbox & Live)

Is document me Stripe ka **Ready-Made Checkout Page** aur **API Keys** attach karne ka step-by-step tareeqa diya gaya hai.

---

## 📌 1. Humein Kaun Si Keys & Variables Chahiye?

Aapko apne `.env` file me sirf yeh **3 variables** set karne hain:

```env
# Mode (Test ke liye true, Live ke liye false)
VITE_STRIPE_SANDBOX_MODE=true

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Qlks9BS7twgQ4KvQ4MuRxb4JMJ9s65Eo9kC38dqy9dc8I47uyi9pen2KE4iPOHfYm5OTU4bvuwoUYWLEeUBC9Vx00lDH28t8k

# Stripe Secret Key (Sandbox test key)
VITE_STRIPE_SECRET_KEY=sk_test_51Qlks9BS7twgQ4Kv0rsmIs26EfLXGZF39XNJwcSRMpP2CbcCFGG8vOpIHuGTvbenRgagCirrVuY9c8Udn7ypawNa00VJmzyHrL

# Stripe Ready-Made Checkout Page Link (Pro Plan $49/mo - User Created & Active!)
VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/test_3cI5kC40zcoF3qKdsS7EQ01
```

---

## 🧪 2. Sandbox (Test Mode) Setup — Pehle Isse Test Karein

Pehle testing ke liye client ke Stripe account se **Test Mode** ki keys nikaalein:

### Step 1: Stripe Dashboard me Test Mode On karein
1. [Stripe Dashboard](https://dashboard.stripe.com) me login karein.
2. Top-right corner par **"Test mode"** ka toggle switch **ON** karein (orange color me Test mode badge dikhayi dega).

### Step 2: Test Publishable Key Copy karein
* 🔗 **Direct Link:** [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
* Wahan **Publishable key** dekhein (yeh `pk_test_...` se start hoti hai).
* Isse copy karein aur `.env` me daalein:
  ```env
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_AapkiKeyYahan
  ```

### Step 3: Test Ready-Made Checkout Page Link Banayein
* 🔗 **Direct Link:** [https://dashboard.stripe.com/test/payment-links](https://dashboard.stripe.com/test/payment-links)
* **"New" / "Create payment link"** button par click karein.
* **Product:** "Standard Pro Tier" select karein ya naya banayein ($49 USD/month recurring ya one-time).
* **After payment settings (Redirect URL):**
  - Left sidebar me **"After payment"** tab par click karein.
  - Select karein: **"Don't show confirmation page"** (Redirect customers to your website).
  - Redirect URL me daalein:
    ```
    http://localhost:5173/dashboard/subscriptions?payment_status=success&plan=pro
    ```
    *(Note: Live hone par `localhost:5173` ki jagah apni live website ka domain daal dein)*.
* Top-right me **"Create link"** par click karein.
* Jo link milegi (e.g. `https://buy.stripe.com/test_...`), use copy karke `.env` me daalein:
  ```env
  VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/test_AapkaLinkYahan
  ```

---

## 🚀 3. Live (Production) Mode Setup — Client ke Live Account ke Liye

Jab test mode me sab kuch confirm ho jaye, tab live switch karein:

### Step 1: Stripe Dashboard me Test Mode OFF karein
1. Top-right corner se **"Test mode"** toggle switch **OFF** karein.

### Step 2: Live Publishable Key Copy karein
* 🔗 **Direct Link:** [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
* Wahan **Publishable key** copy karein (yeh `pk_live_...` se start hoti hai).
* `.env` me paste karein:
  ```env
  VITE_STRIPE_PUBLISHABLE_KEY=pk_live_AapkiLiveKeyYahan
  ```

### Step 3: Live Ready-Made Checkout Page Link Banayein
* 🔗 **Direct Link:** [https://dashboard.stripe.com/payment-links](https://dashboard.stripe.com/payment-links)
* **"Create payment link"** par click karke Pro Plan ($49) banayein.
* **After payment** me redirect URL daalein:
  ```
  https://yourwebsite.com/dashboard/subscriptions?payment_status=success&plan=pro
  ```
* Generated live link (e.g. `https://buy.stripe.com/...`) copy karke `.env` me daalein:
  ```env
  VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/AapkaLiveLinkYahan
  VITE_STRIPE_SANDBOX_MODE=false
  ```

---

## 🔍 4. Checkout Page Kaam Kar Raha Hai Ya Nahi — Kaise Check Karein?

Aap 2 tareeqon se immediately test kar sakte hain:

### Method A: Ready-Made Checkout Page Se Test Karna
1. Project run karein: `bun run dev` (ya `npm run dev`).
2. Browser me login karke **User Dashboard > Subscriptions** page par jayein.
3. **"Upgrade to Pro"** click karein.
4. Modal me **"Open Ready-Made Stripe Checkout"** button par click karein.
5. Stripe ka official checkout page open hoga:
   - Card number: `4242 4242 4242 4242`
   - Expiry date: Koi bhi future date (e.g. `12/34`)
   - CVC: `123`
   - Name & Zip: Koi bhi naam aur `90210`
6. Pay button click karne par Stripe automatically aapki website par redirect karega.
7. **Result:** Website par aate hi notification aayega:  
   *`🎉 Payment Successful via Stripe! Your account is now upgraded to Standard Pro Tier.`*

### Method B: In-Modal Direct Card Test (Instant)
Agar aap Stripe Checkout redirect ke bagair direct modal me test karna chahein:
- Modal me test card auto-fill karein ya **"⚡ 1-Click Test Approve"** button dabayein.
- User ka plan turant **PRO** me upgrade ho jayega aur **Deposits & Invoices** table me record ban jayega.

---

## 📊 5. Verification Checklist (Confirming Success)
- [ ] User ka active badge **Pro Tier** show ho raha hai.
- [ ] User ke **Invoice History** table me Stripe transaction `approved` status ke saath dikh raha hai.
- [ ] Super Admin portal (`/super/deposits`) me Stripe payment ki entry aur revenue calculate ho raha hai.
