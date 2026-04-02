# Innehåll

1. [Problem och lösning](#problem-och-lösning)
2. [Behovs- och marknadsanalyser](#behovs--och-marknadsanalyser)  

    2.1 [Behovsanalys](#behovsanalys)  
    2.2 [Marknadsanalys](#marknadsanalys)

3. [Kravspec](#kravspec)
4. [Ansvarsfördelning](#ansvarsfördelning)
5. [Länkar](#länkar)

# Problem och lösning/idé

**Problem:** personer som tränar vet inte vad de bör träna idag utifrån återhämtning, föregående pass och aktuellt träningsmål, trots stora mängder tillgänglig data.

**Lösning:** en app som föreslår ett optimalt pass baserat på enkel analys av historik + användarens träningsmål.

# Behovs- och marknadsanalyser

Vi har använt oss av ChatGPT för analyserna ([https://chatgpt.com/s/t_69cd...](https://chatgpt.com/s/t_69cd54ad095c8191a0c80afcd20092df)).

## Behovsanalys

### Identifierat användarbehov

Det finns ett tydligt behov av stöd i att välja **rätt träningspass för just den aktuella dagen**. Problemet uppstår när användaren har en träningsplan eller ett tänkt pass, men dagsformen inte matchar planen. Det kan bero på exempelvis sömnbrist, stress, träningsvärk, låg återhämtning, hög belastning från tidigare pass eller begynnande skadokänning. Forskning om autoreglerad träning utgår just från att prestationsförmåga varierar från dag till dag beroende på kombinationen av fitness, fatigue och readiness.

#### Inlägg som visar på problematiken och användarbehovet

[**Garmin Low Training Readiness - Move Workout or Skip (Trainer Road forum)**](https://www.trainerroad.com/forum/t/garmin-low-training-readiness-move-workout-or-skip/79182)  
Användaren beskriver ett väldigt konkret problem: Garmin säger att träningsberedskapen är låg och rekommenderar vila, men dagens träningsplan säger ändå att ett pass ska köras. Frågan blir om passet ska flyttas, hoppas över eller köras ändå.

[**Adjusting training plan based on recovery metrics? HRV, training readiness, etc (80/20 Endurance forum)**](https://www.forum.8020endurance.com/topic/adjusting-training-plan-based-on-recovery-metrics-hrv-training-readiness-etc/)  
Här kommer problemet fram tydligt: när användaren ser en nedåtgående trend på såväl träningsdata som vitalparametrar – och det dessutom stämmer med hur kroppen känns – bör man sänka intensiteten den dagen? Inlägget visar att användare faktiskt behöver omvandla kroppssignaler och data till ett nytt passval, inte bara läsa av siffror.

[**Dagsform får avgöra i vilken ordning veckans pass blir av (Instagram-inlägg)**](https://www.instagram.com/p/DVrYcPAjFu_/)  
Posten beskriver att ett långt pass tagit mycket kraft och att dagsformen därför får styra ordningen på veckans kommande pass. Det är ett bra exempel på hur ett statiskt träningsschema inte fungerar, utan att användare behöver göra om schemat utifrån belastning från tidigare pass.

[**Jag har förälskat mig i löpningen … bör man helt vila? (Inlägg i löpargrupp på Facebook)**](https://www.facebook.com/groups/1612602792227149/posts/3010817735738974/)  
Frågan gäller om man ska småjogga för återhämtning eller ta en ren vilodag när man känner sig sliten. Det är mycket relevant som vardagligt exempel på hur användare tvekar mellan aktivitet och vila. 

[**Bör man ha vilodag mellan gympass och löpning? (Inlägg i löpargrupp på Facebook)**](https://www.facebook.com/groups/1612602792227149/posts/3519725731514836/)  
Användaren frågar om återhämtning mellan olika typer av träning och om hur man ska planera belastningen mellan pass. Det visar att användare inte bara undrar vad de ska träna utan också när kroppen är redo för nästa pass.

### Vad problemet består i

Det centrala problemet är inte att användare saknar träningsmål eller träningsvilja, utan att de saknar ett tryggt beslutsstöd när de frågar sig:
- Ska jag köra det planerade passet? 
- Ska jag sänka intensiteten? 
- Ska jag byta till ett annat slags pass? 
- Ska jag vila helt? 

I öppna forum syns detta mycket tydligt. I TrainerRoad-forumet frågar användare om de ska flytta eller hoppa över ett planerat pass när Garmin visar låg training readiness. På Garmin-forumet finns flera trådar där användare beskriver att systemets readiness-värde säger att kroppen är sliten, medan dagens träningsförslag ändå uppmuntrar aktivitet. Det visar att användaren ofta får data, men inte ett tydligt svar på vad datan betyder i praktiken för dagens passval.

### Dagsform, skador och träningsbelastning

Behovet blir särskilt tydligt i situationer där användaren försöker väga samman flera faktorer samtidigt:
- hur kroppen känns i dag 
- hur hårt föregående pass var 
- om det finns smärta eller skadokänning 
- vad användaren vill uppnå med träningen

Forumdiskussioner om exempelvis soreness, shin splints, leg fatigue och HRV visar att många motionärer har svårt att avgöra om de ska träna som planerat, träna lättare eller vila. Därmed finns ett tydligt behov av ett system som inte bara visar återhämtningsdata, utan också översätter den till ett konkret träningsförslag.

### Slutsats i behovsanalysen

Behovsanalysen visar att det finns ett verkligt användarproblem: många tränande personer vet **vad de vill uppnå**, men har svårt att avgöra **vilket pass som är mest lämpligt just i dag**. Det gäller särskilt när dagsform, återhämtning och tidigare belastning inte stämmer överens med det planerade upplägget. Er appidé adresserar därför ett konkret behov av mer situationsanpassat träningsstöd.

## Marknadsanalys

### Marknadens utveckling

Marknaden för digital träning och fitnessappar är stor och växande. Flera marknadsrapporter pekar på fortsatt stark tillväxt, driven av ökad användning av mobilappar, personalisering, AI och integration med wearables. Det betyder att det finns en växande teknisk och kommersiell grund för tjänster som bygger på användardata och individanpassade rekommendationer.

Samtidigt fortsätter wearables-marknaden att växa. IDC rapporterar att globala wearable-leveranser nådde 611,5 miljoner enheter under 2025. Det stärker marknadsförutsättningarna för tjänster som använder data om återhämtning, puls, sömn och belastning som underlag för rekommendationer.

### Indikationer på efterfrågan

Det finns tydliga tecken på att användare redan accepterar och efterfrågar digitalt träningsstöd. Strava uppger att plattformen har över 180 miljoner användare globalt, och deras användardata visar ett fortsatt starkt engagemang i träningscommunityn. Även på den svenska marknaden ligger appar som Strava, Fitbit, Lifesum och StrengthLog högt inom kategorin hälsa och träning, vilket visar att målgruppen redan är van att använda appar för träning, hälsodata och uppföljning.

### Konkurrenssituationen

Marknaden är dock inte tom. Det finns redan flera etablerade aktörer som erbjuder närliggande funktioner:
- Garmin erbjuder Training Readiness baserat på bland annat sömn, HRV, stresshistorik och akut belastning. 
- Oura erbjuder Readiness Score som väger in kroppssignaler, aktivitet och återhämtning. 
- WHOOP använder recovery-data för att ge rekommenderad strain target. 
- TrainerRoad arbetar med AI-baserad anpassning och workout alternates. 
- Fitbod rekommenderar styrkepass utifrån träningshistorik och muskelåterhämtning. 
- Freeletics marknadsför snabb anpassning av dagens träningspass när förutsättningarna förändras.

Det betyder att marknaden redan har validerat idén om personaliserad och adaptiv träning. Samtidigt betyder det också att ni behöver särskilja er tydligt.

### Möjlig position på marknaden

Dem mest intressanta positioneringen är inte att vara ännu en generell träningsapp, utan att vara ett **beslutsstöd för dagens bästa pass**. Många befintliga lösningar visar återhämtningsstatus eller ger en readiness-poäng, men användaren måste ofta själv översätta det till ett konkret passval. Där har ni en tydlig möjlighet: att gå från data till faktisk rekommendation.

Det kan formuleras som att tjänsten hjälper användaren att välja mellan exempelvis:
- hårt pass,
- lätt pass,
- alternativ träningsform,
- återhämtningspass,
- vila,
utifrån dagsform, träningshistorik, tidigare belastning och träningsmål.

### Slutsats i marknadsanalysen

Marknadsanalysen visar att det finns god efterfrågan på personaliserade träningslösningar och att marknaden redan rör sig mot mer adaptiva och datadrivna träningsrekommendationer. Samtidigt finns flera konkurrenter inom angränsande områden. Det innebär att er idé har marknadspotential, men att framgången sannolikt beror på hur tydligt ni kan särskilja er som en tjänst som rekommenderar **rätt pass för rätt dag**, snarare än bara visar träningsdata eller följer ett statiskt schema.

# Kravspec

-	Användarprofil med användaruppgifter (namn, ålder, träningsmål)
-	Möjlighet att logga utförda träningspass (styrketräning, löpning(?))
-	Ha en pott med belastningspoäng som aktiviteters belastning
-	Rekommendera ett optimalt träningspass för en given dag baserat på historik
-	Lista olika träningspass
-	Lista övningar som ingår i ett träningspass
-	Lista muskelgrupper som påverkas av övningarna

# Ansvarsfördelning

- DB-arkitektur och ER-diagram (Oscar)
- Supabase/DB-setup (Harald)
- CI/CD-setup och GitHub-rulesets (Oscar)
- Wireframes (Ilma/Deniz)
- Grafisk profil (?)
- Funktioner/sektioner/sidor
    - Startsida (?)
    - Användarprofil (?)
    - Förslag på träningspass (?)
    - Träningspass (?)
    - Övningsdetaljer (?)
- Logik (?)
- Enhets-, integrations och P2P-tester (utförs av personen som utvecklat funktionen/sektionen/sidan)

# Länkar

**Trello:** [https://trello.com/invite/b/69cb...](https://trello.com/invite/b/69cb92cb78f2cb68edcd1841/ATTIa020c48874b38a39b4f5a367b5f6eea5EC37AA13/grupp-4-devops-kunskapslontroll-2)

**Live demo:** https://fsu25d-devops-kunskapskontroll-2.vercel.app/