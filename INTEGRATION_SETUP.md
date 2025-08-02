# Integrarea Frontend-Backend pentru Onboarding

## Configurare

### 1. Variabile de mediu

Creează un fișier `.env.local` în directorul rădăcină al proiectului cu următoarele variabile:

```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://dev-yoahhynor77afnh2.us.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
AUTH0_AUDIENCE='https://socialdrive.app/api'
AUTH0_SCOPE='openid profile email'

# Backend API Configuration
NEXT_PUBLIC_API_URL='http://localhost:3010/api'
```

### 2. Configurare Auth0

Asigură-te că în Auth0 ai configurat:
- Un API cu audience: `https://socialdrive.app/api`
- Un aplicație cu callback URL: `http://localhost:3000/api/auth/callback`
- Permisiuni pentru API-ul tău

### 3. Pornirea aplicațiilor

1. **Backend** (din directorul `socialdrive-be`):
   ```bash
   ./gradlew bootRun
   ```

2. **Frontend** (din directorul rădăcină):
   ```bash
   npm run dev
   ```

## Funcționalități implementate

### 1. Verificarea statusului onboarding-ului
- La login, se verifică automat statusul onboarding-ului pe backend
- Se sincronizează cu localStorage pentru performanță
- Fallback la localStorage în caz de eroare de rețea

### 2. Completarea onboarding-ului
- Datele sunt trimise către backend prin API
- Se salvează și în localStorage pentru redundanță
- Gestionarea erorilor cu fallback local

### 3. Gestionarea logout-ului
- La logout se curăță automat datele din localStorage
- Se resetează state-ul aplicației

### 4. Încărcarea datelor din backend
- Tipurile de afacere și industriile se încarcă din backend
- Fallback la date hardcodate în caz de eroare

## Structura API

### Endpoint-uri utilizate:
- `GET /api/onboarding/status` - Verifică statusul onboarding-ului
- `POST /api/onboarding/complete` - Completează onboarding-ul
- `GET /api/onboarding/business-details` - Obține detaliile afacerii
- `GET /api/onboarding/business-types` - Lista tipurilor de afacere
- `GET /api/onboarding/industries` - Lista industriilor
- `GET /api/onboarding/check-completion` - Verifică completarea

### Autentificare:
- Se folosește Auth0 pentru autentificare
- Token-ul de acces se obține prin `/api/auth/token`
- Se trimite în header-ul `Authorization: Bearer <token>`

## Gestionarea erorilor

1. **Eroare de rețea**: Fallback la localStorage
2. **Eroare de autentificare**: Redirect la login
3. **Eroare de validare**: Afișare mesaje de eroare în UI
4. **Eroare de sincronizare**: Salvare locală cu notificare

## Testare

1. Conectează-te cu un cont Auth0
2. Completează onboarding-ul
3. Verifică că datele sunt salvate în backend
4. Deconectează-te și reconectează-te
5. Verifică că datele sunt încărcate corect

## Debugging

Pentru debugging, verifică:
- Console-ul browser-ului pentru erori
- Network tab pentru cererile API
- LocalStorage pentru datele salvate local
- Logs-urile backend-ului pentru erori de server 