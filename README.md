
# Product Manager

En responsiv webbapplikation för produktadministration,
utvecklad som ett miniprojekt inom frontendutveckling
på EC Utbildning.

## Om projektet

Syftet med projektet är att skapa en webbapplikation
där användaren kan lägga till, visa och ta bort produkter.

Applikationen använder JavaScript och Fetch API för
att kommunicera med en backend byggd med Node.js
och Express. Produkterna lagras permanent i en
SQLite-databas.

## Funktionalitet

- Visa alla produkter från databasen.
- Lägg till nya produkter.
- Ta bort befintliga produkter.
- Validera obligatoriska formulärfält.
- Kontrollera att priset är ett positivt nummer.
- Uppdatera produktlistan utan att ladda om sidan.
- Återställ formuläret efter lyckad registrering.
- Visa felmeddelanden och bekräftelser.
- Bekräfta borttagning av produkter.
- Responsiv design för olika skärmstorlekar.

## Teknologier

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- DOM-manipulation

### Backend

- Node.js
- Express.js
- SQLite
- REST API

### Versionshantering

- Git
- GitHub

## Installation

1. Klona projektet från GitHub.
2. Öppna projektmappen i terminalen.
3. Installera projektets beroenden:

       npm install

4. Starta servern:

       npm run dev

5. Öppna webbläsaren:

       http://localhost:3000

Databasen skapas automatiskt när servern startas.

## API Endpoints

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | /api/products | Hämtar alla produkter |
| POST | /api/products | Skapar en ny produkt |
| DELETE | /api/products/:id | Tar bort en produkt |

## HTTP-statuskoder

| Statuskod | Beskrivning |
|-----------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Databas

Projektet använder SQLite för permanent lagring
av produktinformation.

Tabellen products innehåller följande kolumner:

| Kolumn | Datatyp |
|--------|---------|
| id | INTEGER |
| name | TEXT |
| price | REAL |
| sku | TEXT |
| description | TEXT |

## Projektstruktur

    product-manager/
    ├── public/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── database.js
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

## Validering och felhantering

Applikationen använder validering i HTML,
JavaScript och backend.

HTTP-statuskoder kontrolleras innan produktlistan
uppdateras. Felmeddelanden visas om en förfrågan
misslyckas.

## Lärandemål

Under projektet har jag arbetat med:

- Kommunikation mellan frontend och backend.
- Asynkron JavaScript med async och await.
- HTTP-metoder och statuskoder.
- Dynamisk DOM-manipulation.
- Formulärvalidering.
- SQL och databashantering.
- Felhantering med try och catch.
- Versionshantering med Git och GitHub.

## Utvecklare

Amel Huremovic

Frontend Developer Student
EC Utbildning, 2026
