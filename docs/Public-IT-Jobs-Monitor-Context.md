# Context proiect - Public IT Jobs Monitor

## Scop

Doresc să dezvolt o aplicație Node.js care monitorizează website-uri ale
instituțiilor publice din România și mă notifică atunci când apar
posturi sau actualizări relevante pentru domeniul IT.

Scopul inițial NU este să monitorizez toate posturile publice, ci doar
cele din IT.

În timp, aplicația trebuie să poată monitoriza mai multe instituții și
să devină un "agent" care urmărește oportunități de angajare în
administrația publică.

------------------------------------------------------------------------

# Prima instituție

Prima instituție monitorizată va fi:

https://pcatimisoara.mpublic.ro/index.php/ro/resurse-umane/posturi-vacante

Pe această pagină NU există secțiuni separate.

Toate anunțurile sunt publicate într-o singură listă cronologică.

În aceeași listă apar:

-   concursuri pentru grefieri
-   promovări
-   transferuri
-   posturi administrative
-   rezultate
-   contestații
-   specialist IT
-   etc.

Prin urmare aplicația NU trebuie să trimită notificări pentru toate
postările.

Trebuie să filtreze doar cele relevante pentru IT.

------------------------------------------------------------------------

# Cum trebuie detectate anunțurile

Nu vrem să căutăm expresii precum:

-   rezultate
-   barem
-   contestații
-   proba scrisă

pentru că acestea apar și la alte concursuri.

Filtrarea trebuie făcută exclusiv după expresii specifice IT.

Exemple:

-   specialist IT
-   specialist informatic
-   specialist în tehnologia informației
-   administrator sistem
-   administrator rețea
-   inginer sistem
-   expert IT
-   informatician

Textul trebuie normalizat:

-   lowercase
-   eliminare diacritice
-   eliminare spații multiple

------------------------------------------------------------------------

# Arhitectura

Aplicația trebuie gândită astfel încât să poată fi extinsă ușor.

``` text
public-it-jobs-monitor/
│
├── src/
│   ├── index.ts
│   ├── fetch-page.ts
│   ├── parse-pcat.ts
│   ├── relevance.ts
│   ├── storage.ts
│   └── notify.ts
│
├── data/
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

------------------------------------------------------------------------

# Nu folosim SQLite momentan

Inițial s-a propus SQLite.

Am decis că este overkill pentru prima versiune.

Prima versiune trebuie să fie cât mai simplă.

Vom salva datele într-un fișier JSON.

Exemplu:

``` text
data/seen.json
```

Acesta va conține toate anunțurile deja văzute.

La fiecare rulare:

1.  descarcă pagina
2.  extrage toate anunțurile
3.  compară cu `seen.json`
4.  dacă apare unul nou și este relevant pentru IT → trimite notificare

------------------------------------------------------------------------

# MVP

Prima versiune trebuie să facă doar atât:

1.  Descarcă pagina.
2.  Parsează lista de anunțuri.
3.  Extrage:
    -   titlu
    -   link
4.  Compară cu `seen.json`.
5.  Dacă este anunț nou, verifică dacă este relevant.
6.  Dacă este relevant, afișează în consolă.

Emailul se adaugă ulterior.

------------------------------------------------------------------------

# Notificări

Prima versiune:

-   `console.log()`

A doua versiune:

-   email prin Gmail SMTP.

Nu folosim încă:

-   Telegram
-   Discord
-   Pushbullet
-   Slack

------------------------------------------------------------------------

# Extensii viitoare

În viitor aplicația trebuie să poată monitoriza mai multe instituții.

Exemple:

-   Primăria Arad
-   Consiliul Județean Arad
-   Prefectura Arad
-   Parchete
-   Instanțe
-   ANAF
-   Universități
-   Spitale
-   Inspectorate

Ideal fiecare instituție va avea propriul parser.

``` text
sources/
├── pcat.ts
├── primariaArad.ts
└── anaf.ts
```

Toate vor întoarce aceeași structură:

``` ts
Announcement
```

------------------------------------------------------------------------

# Tehnologii

-   Node.js
-   TypeScript
-   cheerio
-   dotenv
-   nodemailer
-   JSON storage

Nu folosim încă:

-   SQLite
-   Playwright
-   Puppeteer
-   AI

------------------------------------------------------------------------

# De ce nu folosim Playwright

Mai întâi trebuie verificat dacă pagina poate fi citită folosind
`fetch()`.

Dacă merge, nu folosim Playwright.

Playwright devine fallback doar pentru site-uri care generează
conținutul prin JavaScript.

------------------------------------------------------------------------

# Workflow

-   **v1** -- fetch + cheerio + JSON + console.log
-   **v2** -- email
-   **v3** -- scheduler
-   **v4** -- GitHub Actions
-   **v5** -- mai multe instituții

------------------------------------------------------------------------

# Stilul codului

Se dorește:

-   cod simplu
-   foarte ușor de citit
-   fără overengineering
-   fără design patterns inutile
-   fără framework-uri

Prefer soluții simple și clare.

------------------------------------------------------------------------

# Obiectiv final

Aplicația trebuie să devină un monitor pentru posturi IT din
administrația publică.

Nu trebuie să fie legată de un singur site.

PCAT este doar prima sursă.

În viitor trebuie să poată adăuga foarte ușor surse noi.

------------------------------------------------------------------------

# Observație importantă

Nu vreau ca proiectul să fie construit ca un demo.

Vreau un proiect suficient de curat încât să îl pot extinde în timp, dar
fără să sacrific viteza de dezvoltare a primei versiuni.

Prefer să avem un MVP funcțional în câteva ore și apoi să iterăm asupra
lui.
