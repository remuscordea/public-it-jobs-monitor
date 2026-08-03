# Public IT Jobs Monitor

Aplicatie Node.js + TypeScript care monitorizeaza pagina de posturi vacante a PCAT Timisoara si detecteaza anunturi noi legate de IT.

## Cerinte

- Node.js 20 sau mai nou
- acces la internet din calculatorul pe care ruleaza

## Instalare

```powershell
npm install
```

## Configurare notificari

Copiaza `.env.example` ca `.env`. Fisierul `.env` este ignorat de Git si nu trebuie publicat.

Modul implicit afiseaza notificarile in consola:

```dotenv
NOTIFIER=console
```

Pentru email prin Gmail SMTP:

```dotenv
NOTIFIER=email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=adresa-ta@gmail.com
SMTP_PASSWORD=parola-de-aplicatie
NOTIFICATION_EMAIL=destinatar@example.com
```

### Gmail App Password

1. Activeaza verificarea in doi pasi pentru contul Google.
2. Deschide setarile contului Google si cauta **App passwords**.
3. Genereaza o parola de aplicatie pentru monitor.
4. Salveaza parola generata in `SMTP_PASSWORD`.

Nu folosi parola obisnuita a contului Gmail. Aplicatia nu afiseaza configuratia SMTP sau parola in loguri.

## Testarea accesului si a parserului

```powershell
npm run diagnose
```

Comanda descarca pagina PCAT, afiseaza primele anunturi extrase si salveaza HTML-ul in `data/last-page.html` pentru diagnostic.

## Prima rulare

```powershell
npm run dev
```

Prima rulare initializeaza `data/seen.json` cu toate anunturile existente si nu trimite notificari.

## Rulari ulterioare

```powershell
npm run dev
```

In modul `console`, anunturile IT noi sunt afisate in consola. In modul `email`, toate anunturile IT noi din acea rulare sunt trimise intr-un singur email.

Notificarea este trimisa inainte ca noile anunturi sa fie salvate. Daca SMTP esueaza, istoricul nu este modificat, iar notificarea poate fi reincercata la urmatoarea rulare.

## Test fara modificarea istoricului

```powershell
npm run check
```

Dry-run-ul nu trimite email si nu modifica `data/seen.json`; anunturile relevante sunt afisate in consola.

Pentru a verifica separat configuratia si livrarea Gmail fara a modifica `seen.json`:

```powershell
npm run test:email
```

Aceasta comanda trimite un singur mesaj de test la `NOTIFICATION_EMAIL` si nu citeste sau scrie istoricul.

## Teste automate

```powershell
npm test
```

## Build

```powershell
npm run build
npm start
```

## Probleme de acces

Daca pagina expira, verifica URL-ul in browser, ruleaza `npm run diagnose` si, daca este necesar, mareste timeout-ul:

```powershell
$env:FETCH_TIMEOUT_MS="60000"
npm run diagnose
```

## Comportament storage

- `data/seen.json` este creat automat;
- toate anunturile sunt memorate, inclusiv cele non-IT;
- doar anunturile IT noi sunt raportate;
- fisierul nu este suprascris daca descarcarea, parsarea sau notificarea esueaza;
- dry-run-ul nu trimite notificari si nu scrie istoricul.

## Urmatoarele etape

1. confirmarea parserului pe HTML-ul real PCAT;
2. Windows Task Scheduler;
3. surse suplimentare din Arad;
4. GitHub Actions sau un server permanent.
