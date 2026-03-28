# Huishoud Van Bogaert

Een Nederlands-sprekende huishoudelijke managementapplicatie gebouwd met React, Vite en Supabase.

## Overzicht

Huishoud Van Bogaert is een webapplicatie ontworpen voor huishoudens met meerdere gebruikers om gemeenschappelijke taken, planning en boodschappen te beheren.

## Functionaliteiten

### 1. Authenticatie (Login.jsx)
- Login met gebruikersnaam (niet email)
- Vier vaste gebruikers met ingebouwde wachtwoorden
- Supabase Auth integratie

### 2. Dashboard (Dashboard.jsx)
- Snelle statistieken: totaal taken, actieve, afgeronde, boodschappen
- Responsief grid (2 kolommen mobiel, 4 desktop)
- Overzicht van recente taken

### 3. Takenbord (Takenbord.jsx)
- Taken management met status (todo/bezig/klaar)
- Prioriteit levels (hoog/normaal/laag)
- CategorieÃ«n (keuken, badkamer, etc.)
- Filters en zoeken
- Reacties/commentaar optie
- Foto-ondersteuning
- Nieuwe taken toevoegen

### 4. Planning (Planning.jsx)
- Weeklyview met 7 dagen
- Blokken: Ochtend, Namiddag, Hele dag
- Click-to-assign interface
- Responsive table (scrollable op mobiev)

### 5. Boodschappen (Boodschappen.jsx)
- Shopping list met vinkjes
- Afgeronde items appart weergegeven
- Voeg items toe, verwijder items
- Filter openstaande items

### 6. Uren (Uren.jsx)
- Track werkuren per dag
- Start- en eindtijd
- Pauze-berekening
- Automatische netto-uren berekening
- Totalen per week/maand

### 7. Layout (Layout.jsx)
- Responsieve header/navigatie
- Desktopnavigatie: horizontaal in header
- Mobile navigatie: fixed bottom bar (60px)
- Logout functionaliteit
- Gebruikersnaam weergave

## Responsief Design

- **Breakpoint**: 768px (mobiel/tablet grens)
- **useMobile hook**: Eenvoudig responsive component building
- **Mobile-first CSS**: Mobile optimaal, schaal naar desktop
- **Touch targets**: Minimaal 44x44px
- **Grids**: 2 kolommen mobiel, 4 desktop

## Color Scheme

```
Primair: #1e3a5f (donkerblauw)
Secundair: #2d5f8a (lichter blauw)
Wit: #ffffff
Licht: #f5f5f5
Gevaar: #dc3545 (rood)
Succes: #28a745 (groen)
Waarschuwing: #ffc107 (geel)
```

## Gebruikerstoegang (RECHTEN)

| Gebruiker | Olivier & Ashley | Jan |
|-----------|-----------------|-----|
| Olivier   | âœ“               | âœ—   |
| Ashley    | âœ“               | âœ—   |
| Jan       | âœ—               | âœ“   |
| Edna      | âœ“               | âœ“   |

Deze worden beheerd via de `huishouden_ids` array in de `gebruikers` tabel.

## Database Schema

### huishoudens
- `id` (UUID, primary key)
- `naam` (TEXT) - Huishouden naam

### gebruikers
- `id` (UUID, references auth.users)
- `naam` (TEXT) - Gebruikersnaam
- `huishouden_ids` (TEXT[]) - Array van huishouden IDs

### taken
- `id` (UUID, primary key)
- `taak` (TEXT) - Taak beschrijving
- `huis_id` (UUID, foreign key)
- `status` (TEXT) - 'todo', 'bezig', 'klaar'
- `prioriteit` (TEXT) - 'hoog', 'normaal', 'laag'
- `persoon` (TEXT) - Wie dit doet
- `categories` (TEXT) - Taak categorie
- `datum` (DATE) - Deadline
- `foto_url` (TEXT) - Task foto
- `herhaling` (TEXT) - Herhalingsschema

### reacties
- `id` (UUID, primary key)
- `taak_id` (UUID, foreign key)
- `van` (TEXT) - Wie reageert
- `tekst` (TEXT) - Reactie content
- `created_at` (TIMESTAMP)

### blokken
- `id` (UUID, primary key)
- `dag` (DATE)
- `blok` (TEXT) - 'Ochtend', 'Namiddag', 'Hele dag'
- `huis_id` (UUID, foreign key)
- `tijdslot` (TEXT)
- `gebruiker_id` (UUID((ŒŒŒ‰½½‘Í¡…ÁÁ•¸(´¥‘€€¡UU%°ÁÉ¥µ…Éä­•ä¤(´¥Ñ•µ€€¡QaP¤(´¡Õ¥Í}¥‘€€¡UU%°™½É•¥¸­•ä¤(´•‘……¹€€¡	==18¤(´É•…Ñ•‘}…Ñ€€¡Q%5MQ5@¤((ŒŒŒÕÉ•¸(´¥‘€€¡UU%°ÁÉ¥µ…Éä­•ä¤(´•‰ÉÕ¥­•É}¥‘€€¡UU%°™½É•¥¸­•ä¤(´‘…ÑÕµ€€¡Q¤(´ÍÑ…ÉÑ}Ñ¥©‘€€¡Q%5¤(´•¥¹‘•}Ñ¥©‘€€¡Q%5¤(´Á…Õé•}µ¥¹ÕÑ•¹€€¡%9QH¤(´É•…Ñ•‘}…Ñ€€¡Q%5MQ5@¤((ŒŒŒµ•±‘¥¹•¸(´¥‘€€¡UU%°ÁÉ¥µ…Éä­•ä¤(´Ñ•­ÍÑ€€¡QaP¤(´Ù½½É}•‰ÉÕ¥­•É€€¡UU%°™½É•¥¸­•ä¤(´•±•é•¹€€¡	==18¤(´É•…Ñ•‘}…Ñ€€¡Q%5MQ5@¤((ŒŒ½µÁ½¹•¹ĞÉ¡¥Ñ•ÑÕÉ”((ŒŒŒ½¹Ñ•áĞ€¡ÕÑ¡½¹Ñ•áĞ¹©Íà¤)©…Ù…ÍÉ¥ÁĞ)ì(€ÕÍ•Èèì¥°•µ…¥°°¹…µ”°Á•Éµ¥ÍÍ¥½¹Ìô°(€±½…‘¥¹œè‰½½±•…¸°(€•ÉÉ½ÈèÍÑÉ¥¹œ°(€±½¥¸è€¡¹…µ”°Á…ÍÍİ½É¤€ôøAÉ½µ¥Í”ñÙ½¥ø°(€±½½ÕĞè€ ¤€ôøAÉ½µ¥Í”ñÙ½¥ø)ô)€((ŒŒŒ!½½­Ì(´ÕÍ•5½‰¥±”¡‰É•…­Á½¥¹Ğ€ô€ÜØà¥€€´I•ÑÕÉ¹ÌÑÉÕ”¥˜ÍÉ••¸€ğô‰É•…­Á½¥¹Ğ((ŒŒŒ½µÁ½¹•¹ÑÌ((ŒŒŒŒ1…å½ÕĞ(´I•¹‘•ÉÌµ½‰¥±”½˜‘•Í­Ñ½À±…å½ÕĞ(´AÉ½Ù¥‘•Ì¹…Ù¥…Ñ¥½¸(´!…¹‘±•Ì±½½ÕĞ(´¥á•‰½ÑÑ½´¹…Ø½¸µ½‰¥±”((ŒŒŒŒQ……­-……ÉĞ)AÉ½ÁÌè(´Ñ……­€€´Q…Í¬½‰©•Ğ(´½¹MÑ…ÑÕÍ¡…¹•€€´€¡¥°¹•İMÑ…ÑÕÌ¤€ôøÙ½¥(´½¹I•…Ñ¥½¹±¥­€€´€¡¥¤€ôøÙ½¥(´É•…Ñ¥½¹½Õ¹Ñ€€´¹Õµ‰•È((ŒŒŒŒ¡¥ÁM•±•Ğ)AÉ½ÁÌè(´±…‰•±€€´1…‰•°Ñ•áĞ(´½ÁÑ¥½¹Í€€´ì±…‰•°°Ù…±Õ”õmt(´Ù…±Õ•€€´ÕÉÉ•¹ĞÙ…±Õ”(´½¹¡…¹•€€´€¡¹•İY…±Õ”¤€ôøÙ½¥(´µÕ±Ñ¥Á±•€€´‰½½±•…¸(´Á±…•¡½±‘•É€€´ÍÑÉ¥¹œ((ŒŒMÑå±¥¹œÁÁÉ½… ((´€¨©••¸MLµµ½‘Õ±•Ì¨¨è±±•Ì¥¹±¥¹”ÍÑå±•Ì(´€¨©••¸ÍÑå±•µ½µÁ½¹•¹ÑÌ¨¨èiÕ¥Ù•ÈI•…Ğ(´€¨©••¸Q…¥±İ¥¹¨¨è!…¹‘µ…Ñ¥œ•Í¡É•Ù•¸MLµ¥¸µ)L(´€¨©Y½½É‘•±•¸¨¨è5¥¹‘•È‘•Á•¹‘•¹¥•Ì°Í¹•±±•È±…‘•¸°•µ…­­•±¥©¬……¹Á…ÍÍ•¸((ŒŒÕÑ¡•¹Ñ¥…Ñ¥½¸±½Ü((Ä¸•‰ÉÕ¥­•ÈÙ½•ÉĞ¹……´¥¸½À1½¥¸Á…¥¹„(È¸ÁÀµ…ÁĞ¹……´Ñ¼€è•µ…¥°€¡½±¥Ù¥•É¡Õ¥Í¡½Õ¹±½…°¤(Ì¸MÕÁ…‰…Í”ÕÑ …ÕÑ¡•¹Ñ¥••ÉĞ•µ…¥°€¬İ…¡Ñİ½½É(Ğ¸M•ÍÍ¥½¸İ½É‘Ğ½Á•Í±…•¸¥¸±½…±MÑ½É…”(Ô¸ÕÑ¡½¹Ñ•áĞÑÉ…­Ì±½¥¸ÍÑ…Ñ”(Ø¸ÁÀÑ½½¹ĞÁÉ½Ñ•Ñ•É½ÕÑ•Ì½˜É•‘¥É•Ğ¹……È±½¥¸((ŒŒM•ÕÉ¥Ñä9½Ñ•Ì((´MÕÁ…‰…Í”I½Ü1•Ù•°M•ÕÉ¥Ñä€¡I1L¤Á½±¥¥•Ìé¥©¸¥¹•ÍÑ•±(´•‰ÉÕ¥­•ÉÌ­Õ¹¹•¸…±±••¸‘…Ñ„é¥•¸Ù…¸¡Õ¸¡Õ¥Í¡½Õ‘•¹Ì(´]…¡Ñİ½½É‘•¸İ½É‘•¸¹¥•Ğ¥¸™É½¹Ñ•¹½Á•Í±…•¸(´¹Ù¥É½¹µ•¹ĞÙ…É¥…‰±•Ìİ½É‘•¸¹¥•Ğ¥¸‰É½İÍ•È•áÁ½¹••É((ŒŒM•ÑÕÀ¡•­±¥ÍĞ((´lt9½‘”¹©Ì•¸¹Á´—½¹ÍÑ…±±••É(´ltMÕÁ…‰…Í”ÁÉ½©•Ğ……¹•µ……­Ğ(´lt…Ñ…‰…Í”Í¡•µ„—½µÁ½ÉÑ••É(´lt€Ğ•‰ÉÕ¥­•ÉÌ……¹•µ……­Ğ¥¸ÕÑ (´lt•‰ÉÕ¥­•ÉÌÑ…‰•°¥¹•ÙÕ±(´lt¹Ù¥É½¹µ•¹ĞÙ…É¥…‰•±•¸¥¹•ÍÑ•±(´lt¹Á´¥¹ÍÑ…±±€•ÉÕ¹(´lt¹Á´ÉÕ¸‘•Ù€İ•É­Ğ((ŒŒY½±•¹‘”MÑ…ÁÁ•¸€¡Q=<¤()±Ì©”‘”¥µÁ±•µ•¹Ñ…Ñ¥”İ¥±ĞÕ¥Ñ‰É•¥‘•¸è((Ä¸€¨©MÕÁ…‰…Í”ÅÕ•É¥•Ì¥¹Ñ•É•É•¸¨¨¥¸Á…•Ì€¡•‰ÉÕ¥­•¸ÍÕÁ…‰…Í”¹™É½´ ¥€¤(È¸€¨©ÉÉ½È¡…¹‘±¥¹œ¨¨Ù½½È‘…Ñ…‰…Í”ÅÕ•É¥•Ì(Ì¸€¨©1½…‘¥¹œÍÑ…Ñ•Ì¨¨™½È…±°…Íå¹Œ½Á•É…Ñ¥½¹Ì(Ğ¸€¨©½É´Ù…±¥‘…Ñ¥½¸¨¨™½È…±°¥¹ÁÕÑÌ(€Ô¸€¨©Q½…ÍĞ¹½Ñ¥™¥…Ñ¥½¹Ì¨¨™½ÈÕÍ•È™••‘‰…¬(Ø¸€¨©½Ñ¼ÕÁ±½…¨¨™½È…ÍÍ¥¹µ•¹ÑÌ€¡MÕÁ…‰…Í”MÑ½É…”¤(Ü¸€¨©áÁ½ÉĞ½¥µÁ½ÉĞ¨¨™Õ¹Ñ¥½¹…±¥Ñä(à¸€¨©=™™±¥¹”ÍÕÁÁ½ÉĞ¨¨İ¥Ñ Í•ÉÙ¥”İ½É­•ÉÌ(ä¸€¨©I•…°µÑ¥µ”ÕÁ‘…Ñ•Ì¨¨İ¥Ñ MÕÁ…‰…Í”ÍÕ‰ÍÉ¥ÁÑ¥½¹Ì(ÄÀ¸€¨©…É¬µ½‘”¨¨Ñ½±”((ŒŒ9½Ñ•Ì™½È=±¥Ù¥•È()Q¡¥ÌÁÉ½©•Ğİ…Ì‰Õ¥±ĞÑ¼å½ÕÈÍÁ•¥™¥…Ñ¥½¹Ìè((´ƒŠrI•…Ğ€¬Y¥Ñ”€¡)…Ù…MÉ¥ÁĞ°¹½ĞQåÁ•MÉ¥ÁĞ¤(´ƒŠrÕÑ U$½U`(´ƒŠr€ĞÕÍ•ÉÌİ¥Ñ ½ÉÉ•ĞÁ…ÍÍİ½É‘Ì(´ƒŠr€ĞÕÍ•ÈÁ•Éµ¥ÍÍ¥½¹ÌÁ•ÈÉ½±”(´ƒŠr5½‰¥±”€˜‘•Í­Ñ½ÀÉ•ÍÁ½¹Í¥Ù”(´ƒŠr±°Á…•ÌÑ•µÁ±…Ñ•€¡É•…‘ä™½È‘…Ñ„¤(´ƒŠrMÕÁ…‰…Í”¥¹Ñ•É…Ñ¥½¸‰±Õ•ÁÉ¥¹Ğ(´ƒŠr½±½ÈÍ¡•µ”µ…Ñ¡¥¹œå½ÕÈÁÉ½Ñ½ÑåÁ”(´ƒŠr%¹±¥¹”ÍÑå±•Ì€¡¹¼‰Õ¥±ÍÑ•ÁÌ¹••‘•¤(´ƒŠr±°™¥±•Ì½µÁ±•Ñ”…¹™Õ¹Ñ¥½¹…°((ŒŒ•ÑÑ¥¹œMÑ…ÉÑ•()Q¼½¹Ñ¥¹Õ”‘•Ù•±½Áµ•¹Ğè((Ä¸M•”MQU@¹µ™½ÈMÕÁ…‰…Í”Í•ÑÕÀ(È¸IÕ¸¹Á´¥¹ÍÑ…±±€(Ì¸IÕ¸¹Á´ÉÕ¸‘•Ù€(Ğ¸=Á•¸¡ÑÑÀè¼½±½…±¡½ÍĞèÔÄÜÌ((