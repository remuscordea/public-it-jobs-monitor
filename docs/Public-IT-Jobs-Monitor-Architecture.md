
# Public IT Jobs Monitor — Architecture Notes

## 1. Scop

Aplicația monitorizează pagini publice ale instituțiilor din România și detectează anunțuri noi relevante pentru posturi IT.

Prima sursă:

- PCAT Timișoara — pagina „Posturi vacante”

MVP-ul trebuie să fie simplu, predictibil și ușor de extins.

---

## 2. Fluxul aplicației

La fiecare rulare:

1. descarcă pagina sursei;
2. extrage lista de anunțuri;
3. normalizează titlurile;
4. compară anunțurile cu cele deja salvate;
5. identifică elementele noi;
6. aplică filtrul de relevanță IT;
7. afișează rezultatele relevante;
8. salvează toate elementele noi în storage.

Important:

- la prima rulare nu se trimit notificări;
- prima rulare doar inițializează istoricul;
- ulterior se notifică doar elementele noi și relevante.

---

## 3. Structura proiectului

```text
public-it-jobs-monitor/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── config.ts
│   ├── fetch-page.ts
│   ├── relevance.ts
│   ├── storage.ts
│   └── sources/
│       └── pcat.ts
├── data/
│   └── seen.json
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Modele de date

### Announcement

```ts
export interface Announcement {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  detectedAt: string;
}
```

### JobSource

```ts
export interface JobSource {
  id: string;
  name: string;
  url: string;
  fetchAnnouncements(): Promise<Announcement[]>;
}
```

### StoredState

```ts
export interface StoredState {
  initialized: boolean;
  announcements: Announcement[];
}
```

---

## 5. Generarea ID-ului

ID-ul trebuie să fie stabil între rulări.

Regula recomandată:

```ts
id = sha256(sourceId + "|" + normalizedTitle + "|" + normalizedUrl)
```

Astfel evităm duplicatele chiar dacă ordinea anunțurilor se schimbă.

---

## 6. Normalizarea textului

```ts
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
```

---

## 7. Filtrarea IT

MVP-ul folosește reguli explicite, nu AI.

```ts
const IT_PATTERNS = [
  /\bspecialist\s+it\b/,
  /\bspecialist\s+informatic\b/,
  /\bspecialist\s+in\s+tehnologia\s+informatiei\b/,
  /\binformatician\b/,
  /\badministrator\s+(de\s+)?sistem\b/,
  /\badministrator\s+(de\s+)?retea\b/,
  /\binginer\s+(de\s+)?sistem\b/,
  /\bexpert\s+it\b/,
  /\bconsilier\b.*\binformatic/,
];
```

Pentru fiecare titlu:

```ts
const normalized = normalizeText(title);
const relevant = IT_PATTERNS.some(pattern => pattern.test(normalized));
```

Nu folosim termeni generici precum:

- rezultat
- barem
- contestație
- probă scrisă

Aceștia ar genera rezultate false pentru alte concursuri.

---

## 8. Storage

Fișier:

```text
data/seen.json
```

Exemplu:

```json
{
  "initialized": true,
  "announcements": [
    {
      "id": "abc123",
      "sourceId": "pcat-timisoara",
      "sourceName": "PCAT Timișoara",
      "title": "Anunț privind postul de specialist IT",
      "url": "https://example.com/anunt",
      "detectedAt": "2026-08-03T09:00:00.000Z"
    }
  ]
}
```

Reguli:

- dacă fișierul nu există, se creează;
- scrierea se face după procesarea completă;
- toate anunțurile noi se salvează, nu doar cele relevante;
- notificările se trimit doar pentru cele relevante.

Motivul: aplicația trebuie să știe că a mai văzut și anunțurile nerelevante.

---

## 9. Prima rulare

La prima rulare:

- se descarcă pagina;
- se salvează toate anunțurile curente;
- `initialized` devine `true`;
- nu se trimite nicio notificare.

Acest comportament previne notificarea pentru toate anunțurile istorice.

---

## 10. Parser PCAT

Parserul PCAT trebuie să întoarcă doar:

- titlul;
- URL-ul absolut.

Nu trebuie să aplice filtrarea IT.

Responsabilități separate:

- `sources/pcat.ts` → extrage anunțuri;
- `relevance.ts` → decide dacă sunt IT;
- `storage.ts` → gestionează istoricul;
- `index.ts` → orchestrează fluxul.

---

## 11. Gestionarea erorilor

MVP-ul trebuie să trateze explicit:

- timeout la fetch;
- status HTTP diferit de 200;
- HTML gol;
- parser fără rezultate;
- JSON corupt;
- eroare la scrierea fișierului.

În caz de eroare:

- aplicația afișează un mesaj clar;
- nu suprascrie `seen.json`;
- procesul se încheie cu exit code diferit de 0.

---

## 12. Configurare

În MVP, URL-ul sursei poate fi hardcodat în `pcat.ts`.

Mai târziu poate exista:

```ts
export const sources: JobSource[] = [
  new PcatSource(),
];
```

---

## 13. Dependențe

Runtime:

```bash
npm install cheerio
```

Development:

```bash
npm install -D typescript tsx @types/node
```

Node.js 20+ este suficient deoarece include `fetch`.

---

## 14. Scripturi npm

```json
{
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 15. Pașii de implementare

1. inițializare proiect;
2. definire tipuri;
3. implementare normalizare și relevanță;
4. implementare storage JSON;
5. implementare fetch;
6. implementare parser PCAT;
7. implementare orchestrare;
8. test local;
9. email;
10. scheduler.

---

## 16. Principii

- fără framework;
- fără bază de date în MVP;
- fără Playwright dacă `fetch` funcționează;
- fără AI pentru clasificare în MVP;
- fără notificări duplicate;
- cod simplu și ușor de extins;
- parser separat pentru fiecare instituție.
