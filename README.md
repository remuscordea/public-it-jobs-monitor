# Public IT Jobs Monitor

MVP Node.js + TypeScript care monitorizeaza pagina de posturi vacante a PCAT Timisoara si detecteaza anunturi noi legate de IT.

## Cerinte

- Node.js 20 sau mai nou
- acces la internet din calculatorul pe care ruleaza

Verifica versiunea:

```powershell
node --version
```

## Instalare

```powershell
npm install
```

## Testarea accesului si a parserului

```powershell
npm run diagnose
```

Comanda:

- descarca pagina PCAT;
- afiseaza primele anunturi extrase;
- salveaza HTML-ul in `data/last-page.html` pentru diagnostic.

## Prima rulare

```powershell
npm run dev
```

Prima rulare initializeaza `data/seen.json` cu anunturile existente si nu emite alerte istorice.

## Rulari ulterioare

```powershell
npm run dev
```

Vor fi afisate numai anunturile noi care contin formulări specifice posturilor IT.

## Test fara modificarea istoricului

```powershell
npm run check
```

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

Daca pagina expira:

1. deschide URL-ul in browser;
2. incearca din PowerShell:

```powershell
Invoke-WebRequest "https://pcatimisoara.mpublic.ro/index.php/ro/resurse-umane/posturi-vacante" -UseBasicParsing
```

3. mareste timeout-ul:

```powershell
$env:FETCH_TIMEOUT_MS="60000"
npm run diagnose
```

Daca `Invoke-WebRequest` functioneaza, dar Node.js nu, trimite output-ul comenzii `npm run diagnose`. Daca pagina necesita browser automatizat, Playwright va fi adaugat ca fallback intr-o iteratie ulterioara.

## Comportament storage

- `data/seen.json` este creat automat;
- toate anunturile sunt memorate, inclusiv cele non-IT;
- doar anunturile IT noi sunt raportate;
- fisierul nu este suprascris daca descarcarea sau parsarea esueaza.

## Urmatoarele etape

1. confirmarea parserului pe HTML-ul real PCAT;
2. notificare email;
3. Windows Task Scheduler;
4. surse suplimentare din Arad;
5. GitHub Actions sau un server permanent.
