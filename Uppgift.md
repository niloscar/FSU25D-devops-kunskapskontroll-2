# DevOps, kunskapskontroll 2 – grupp 4

**Redovisning:** Fredag den 27/ kl 08:00 - Instruktioner och schema kommer senare
**Deadline:** Fredag den 27/ kl 23:59
**Grupper:** Ni delas in i grupper 3-5 medlemmar per grupp.

**Inlämning:**
Lämna in github länk via ItsLearning. Repot skall vara public.
Alla filer tillhörande projektet läggs in i samma repo, såsom;
- Behovsanalys,
- eventuell marknadsanalys,
- eventuella mockups.

Ange i README.md filen
- Tilldelande ansvarsområden för varje medlem,
- Vercel länk,
- eventuellt trello länk


## Uppgift

Ni ska skapa ett fullstack projekt efter eget val. Det blir ett tillfälle att repetera alla tekniker vi
har gått igenom, samt se hur alla tekniker funkar tillsammans i en helhet.
Tekniker som är obligatoriska är följande:
- CI/CD flöden med Github Actions och Vercel.
- Github Rulesets
- Tester (Unit, Integration, e2e)
- Versionshantering med PR och Code Review
- Postgres databas med Supabase
- API-anrop
- Frontend

Tekniker som är frivilliga:
- Agila metoder såsom Scrum, med verktyg som Trello/Jira
- TypeScript
- Mockups med Figma


## Faser

### 1 - Behovsanalys (Obligatoriskt)

● Bekanta dig med ett problem i samhället som många vill ha lösning på
● Använd AI för att sammanställa information om problematiken
    ○ Genom AI:ns egen data
    ○ Genom att söka fram relevanta grupper och inlägg i sociala medier
● Ju närmare problematiken man är, desto mer insyn/passion/driv har man för att lösa.
Bäst är om man själv är en del målgruppen som vill ha lösning på problemet

### 2 - Marknadsanalys (Frivilligt)

● Marknadens storlek
● Konkurrenter
● Betalvilja

### 3 - Utveckla lösningen (Obligatoriskt)

Genom fas 1 blir man insatt i problematiken och behoven från målgruppen. Det gör att man
blir väl positionerad för att skapa något som tillför ett faktiskt värde.
● Skissa en kravspec på alla funktioner utifrån behovsanalysen, sorterat efter prioritet
● Jobba Agilt med Scrum via Trello eller Jira (Frivilligt)
● Skapa ett ER diagram på alla nödvändiga tabeller
● Skapa DB och alla tabeller och dess relationer i Supabase
● Konfigurera supabase så att tabellerna blir tillgängliga via ett API
● Skapa Mockups på alla sidor (Frivilligt)
● CI/CD pipeline med Github Actions och Vercel, via guide: getting-started-ci-cd.md
● Kom igång med testerna enligt guiden: get-started-with-tests.md
● Jobba med TS (Frivilligt)
● Dela upp arbetet mellan alla medlemmar (varje medlem utvecklar minst 1 sida med API-anrop)
● Jobba på era delar och skapa tester (Varje medlem skriver tester på sina delar)
● Versionshantera med PR och Code Review ( Använd AI som code reviewer)


## Betygskriterier

**Ni betygsätts som grupp**

**FÖR G**
**● Få till CI/CD flödet enligt guiden: getting-started-ci-cd.md**
**● Kom igång med testerna enligt guiden: get-started-with-tests.md**
**● Versionshantera med PR och Code Review (Använd en AI code reviewer)**
**● Varje gruppmedlem skriver tester på sina egna delar. Minst 1 test av varje typ
(Unit, Integration, e2e)**
● Skriv behovsanalys och kravspec i en PDF
● Skapa ett ER-diagram och en DB i Supabase med minst 5 tabeller
● Skapa lämplig frontend som presenterar data från er DB, via Supabase REST API.
Varje gruppmedlem gör minst 1 sida med API-anrop

Om ni fastnar i hur tester/syntax skrivs i vitest/playwright, ta hjälp av följande filer
- summary-playwright.md
- summary-vitest.md