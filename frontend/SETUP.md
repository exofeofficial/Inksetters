# Inksetters Management System — Setup Guide

A web app with two parts:
- **Public storefront** = **home page** (`/`) — customers ka modern grid jahan se woh online order place karte hain.
- **Owner dashboard** (`/admin`, login required) — Orders, daily **Sales**, **Expenses**, aur
  monthly/yearly **Profit & Loss**.

Data **Firebase Firestore** mein store hota hai.

---

## 1. Firebase project banayein (ek dafa ka kaam)

1. Go to https://console.firebase.google.com → **Add project** → naam do (e.g. `inksetters`).
2. Project ban-ne ke baad, left menu se **Build → Firestore Database → Create database**
   → start in **production mode** → region choose karo → enable.
3. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
4. **Authentication → Users → Add user** → apna email aur password daalo
   (yehi owner login hoga jis se app mein sign-in karoge).
5. Project settings (⚙️ gear icon) → **Your apps** → web icon `</>` → app register karo
   → jo `firebaseConfig` keys milein wo copy kar lo.

## 2. Keys ko app mein daalo

`frontend/.env.local` file kholo aur har value apni Firebase keys se replace karo:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Security rules lagao (zaroori)

Firebase Console → **Firestore Database → Rules** tab → [firestore.rules](firestore.rules)
file ka **poora content** copy karke paste karo → **Publish**.

Yeh rules ye karti hain:
- **Rate list** sabko readable (storefront ke products dikhane ke liye), edit sirf owner.
- **Orders** koi bhi customer create kar sakta hai (online order), magar parhna/accept/delete sirf owner.
- **Sales & Expenses** — sirf logged-in owner.

## 4. App chalao

```
cd frontend
npm install
npm run dev
```

Browser mein `http://localhost:5173` kholo → apne email/password se login karo.

## 5. Pehli dafa istemaal

1. `http://localhost:5173/admin` → owner email/password se login karo → **Rate List** page →
   "Load default rate list" button dabao. Bina products ke storefront khaali rahega.
2. **Storefront** (home) test karo: `http://localhost:5173/` kholo → product boxes add karke
   naam/phone ke saath order place karo. (Navbar par "Owner" link se admin login khulta hai.)
3. **Orders** page (owner) → naya order "Accept → Sale" se Sales mein chala jayega,
   ya Cancel/Delete.
4. **Sales** page → manual/walk-in print record bhi daal sakte ho (product select karte hi
   rate khud aa jayega; discount alag se daal sakte ho).
5. **Expenses** page → bijli/net bill waghera daalo.
6. **Dashboard / Reports** → mahine aur saal ki kamai, kharcha aur **net profit** dekho.

> Customer ko sirf website ka link dena: `https://<your-site>/` (home hi storefront hai).
> Owner khud `https://<your-site>/admin` se login karta hai.

---

### Live deploy (optional)
`npm run build` → `dist/` folder banta hai. Ise Firebase Hosting, Netlify ya Vercel par
free deploy kar sakte ho taake dukaan ke kisi bhi PC/mobile se khule.
