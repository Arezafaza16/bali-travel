# Bali Concierge — Full Stack Setup Guide

## Project Structure

```
bali-travel/
├── baliconcierge/          ← Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── api/client.ts   ← API calls to backend
│   │   ├── pages/ServiceDetailPage.tsx  ← Updated with booking flow
│   │   └── ...
│   └── .env                ← Frontend env vars
│
└── bale-travel/            ← Backend (NestJS + Fastify + MongoDB)
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── services/       ← Availability check & slot management
    │   ├── bookings/       ← Booking creation & OTP
    │   ├── payments/       ← Midtrans Snap integration
    │   └── whatsapp/       ← Admin WhatsApp notification
    └── .env                ← Backend env vars  ← FILL THIS IN
```

---

## 1. Backend Setup (`bale-travel/`)

### Install dependencies
```bash
cd bale-travel
npm install
```

### Configure `.env`
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bali-concierge
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
FONNTE_TOKEN=your_fonnte_token
ADMIN_WHATSAPP_NUMBER=your_whatsapp 
# App
PORT=your_port
FRONTEND_URL=your_frontend_url

```

### Run in development
```bash
npm run start:dev
```

### Run in production
```bash
npm run build
npm start
```

---

## 2. Frontend Setup (`baliconcierge/`)

### Configure `.env`
```env
VITE_API_URL=http://localhost:3001/api
VITE_MIDTRANS_IS_PRODUCTION=false
```

### Run
```bash
npm install
npm run dev
```

---

## 3. Midtrans Setup

1. Register at [https://dashboard.midtrans.com](https://dashboard.midtrans.com)
2. Go to **Settings → Access Keys**
3. Copy your **Server Key** and **Client Key**
4. Paste into `bale-travel/.env`
5. Set `MIDTRANS_IS_PRODUCTION=false` for sandbox, `true` for live

### Midtrans Notification URL (Webhook)
In Midtrans dashboard → **Settings → Configuration → Payment Notification URL**:
```
https://your-domain.com/api/payments/notification
```
For local testing, use [ngrok](https://ngrok.com):
```bash
ngrok http 3001
# then set: https://abc123.ngrok.io/api/payments/notification
```

---

## 4. WhatsApp Admin Notifications (Fonnte)

**Fonnte** (https://fonnte.com) is a popular Indonesian WhatsApp gateway. Free tier available — messages appear from **your own WhatsApp number**.

1. Register at [fonnte.com](https://fonnte.com) (free)
2. Go to **Device → Add Device**
3. Scan the QR code with the WhatsApp you want to send FROM (use a secondary number — unofficial API)
4. Copy the **token** shown on the device page
5. Set in `bale-travel/.env`:
   ```env
   FONNTE_TOKEN=your_fonnte_token_here
   ADMIN_WHATSAPP_NUMBER=628123456789    # admin number (no + or spaces)
   ```

The message sent to admin on each successful booking:
```
🌴 NEW BOOKING — Bali Concierge

📋 Service: Premium White Water Rafting
📅 Date: 2025-12-25
👥 Guests: 3
👤 Customer: John Doe
📞 Phone: +628123456789
💰 Total: Rp 1.500.000
🔑 OTP: 483920
🆔 Order ID: BC-1234567890-ABC12
```

---

## 5. Full Booking Flow

```
User selects date + guests
        ↓
[Check Availability] → GET /api/services/:slug/availability
        ↓
✅ Available → "Book Now & Pay"
        ↓
Customer fills name, email, phone
        ↓
POST /api/bookings  (creates booking, returns orderId)
        ↓
POST /api/payments/create/:orderId  (creates Midtrans token)
        ↓
Midtrans Snap popup opens
        ↓
User pays
        ↓
Midtrans webhook → POST /api/payments/notification
        ↓
Backend: marks booking paid, reserves slots, generates OTP, sends WhatsApp to admin
        ↓
Frontend polls GET /api/payments/status/:orderId
        ↓
OTP modal pops up → user screenshots it
        ↓
Admin receives WhatsApp with: date, service, guests, OTP
```

---

## 6. API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/:slug/availability?date=YYYY-MM-DD&guests=N` | Check availability |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/:orderId` | Get booking details |
| POST | `/api/payments/create/:orderId` | Get Midtrans Snap token |
| POST | `/api/payments/notification` | Midtrans webhook (internal) |
| GET | `/api/payments/status/:orderId` | Poll for OTP after payment |

---

## 7. Service Capacities (Default)

| Service | Default Capacity / Day |
|---------|------------------------|
| White Water Rafting | 20 guests |
| Watersport | 30 guests |
| ATV Quad Bike | 15 guests |
| One Day Tour | 10 guests |

To change, update `SERVICES_CONFIG` in `bale-travel/src/services/services.service.ts`.
