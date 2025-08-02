# Arhitectura Comunicării Frontend-Backend

## 🔄 **Fluxul de comunicare actualizat**

### **Înainte (Problematic):**
```
Client (Browser) → Spring Boot Backend (direct)
```

### **Acum (Securizat):**
```
Client (Browser) → Next.js API Routes → Spring Boot Backend
```

## 🏗️ **Arhitectura detaliată**

### 1. **Client (Browser)**
- Face request-uri către Next.js API Routes
- Nu are acces direct la backend-ul Spring Boot
- Nu expune token-urile Auth0

### 2. **Next.js API Routes (Proxy)**
- `/api/onboarding/status` - Verifică statusul onboarding-ului
- `/api/onboarding/complete` - Completează onboarding-ul
- `/api/onboarding/business-details` - Obține detaliile afacerii
- `/api/onboarding/business-types` - Lista tipurilor de afacere
- `/api/onboarding/industries` - Lista industriilor
- `/api/auth/token` - Obține token-ul Auth0

### 3. **Spring Boot Backend**
- Primește request-uri doar de la Next.js
- Nu expune endpoint-urile direct către client
- Gestionează autentificarea prin Auth0

## 🔐 **Avantajele noii arhitecturi**

### **Securitate:**
- ✅ Token-urile Auth0 nu sunt expuse în browser
- ✅ Nu există probleme de CORS
- ✅ Control complet asupra requesturilor
- ✅ Validare și sanitizare pe server

### **Performanță:**
- ✅ Cache-ul poate fi implementat pe nivel de Next.js
- ✅ Rate limiting pe nivel de API Routes
- ✅ Logging centralizat

### **Mentenabilitate:**
- ✅ Logica de business centralizată
- ✅ Gestionarea erorilor uniformă
- ✅ Transformarea datelor pe server

## 📁 **Structura fișierelor**

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   └── token/
│       │       └── route.ts          # Obține token Auth0
│       └── onboarding/
│           ├── status/
│           │   └── route.ts          # Verifică status onboarding
│           ├── complete/
│           │   └── route.ts          # Completează onboarding
│           ├── business-details/
│           │   └── route.ts          # Detalii afacere
│           ├── business-types/
│           │   └── route.ts          # Tipuri afacere
│           └── industries/
│               └── route.ts          # Industrii
├── lib/
│   ├── api.ts                        # Client API (simplificat)
│   └── useOnboarding.ts              # Hook pentru onboarding
└── middleware.ts                     # Middleware Auth0
```

## 🔧 **Configurare**

### **Variabile de mediu necesare:**
```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://dev-yoahhynor77afnh2.us.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
AUTH0_AUDIENCE='https://socialdrive.app/api'
AUTH0_SCOPE='openid profile email'

# Backend API Configuration
NEXT_PUBLIC_API_URL='http://localhost:3010/api'
```

## 🚀 **Fluxul de funcționare**

### **1. Verificarea statusului onboarding-ului:**
```
Client → /api/onboarding/status → Next.js → Spring Boot → Response
```

### **2. Completarea onboarding-ului:**
```
Client → /api/onboarding/complete → Next.js → Spring Boot → Response
```

### **3. Obținerea datelor publice:**
```
Client → /api/onboarding/business-types → Next.js → Spring Boot → Response
```

## 🛡️ **Gestionarea erorilor**

### **Pe nivel de Next.js API Routes:**
- Validarea autentificării
- Transformarea erorilor din backend
- Logging centralizat
- Rate limiting (opțional)

### **Pe nivel de Client:**
- Gestionarea erorilor de rețea
- Fallback la localStorage
- Notificări pentru utilizator

## 📊 **Monitoring și Debugging**

### **Logs Next.js:**
- Request-uri către API Routes
- Erori de autentificare
- Timpul de răspuns

### **Logs Spring Boot:**
- Request-uri de la Next.js
- Erori de business logic
- Performanța bazei de date

## 🔄 **Migrations și Deploy**

### **Development:**
1. Next.js pe portul 3000
2. Spring Boot pe portul 3010
3. Configurare CORS doar între Next.js și Spring Boot

### **Production:**
1. Next.js și Spring Boot pe același domeniu
2. Configurare proxy în Next.js
3. SSL/TLS pentru toate comunicările

## 🎯 **Beneficii finale**

- **Securitate îmbunătățită**: Token-urile nu sunt expuse
- **Performanță mai bună**: Cache și optimizări pe server
- **Mentenabilitate**: Cod mai curat și centralizat
- **Scalabilitate**: Ușor de extins cu noi endpoint-uri
- **Debugging**: Logging centralizat și mai ușor de urmărit 