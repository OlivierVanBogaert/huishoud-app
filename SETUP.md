# Huishoud Van Bogaert - Installatiehandleiding

## Project Setup

Dit is een React + Vite applicatie voor huishoudelijk beheer.

### Vereisten

- Node.js 16+ en npm
- Supabase account met een project

### Stap 1: Dependencies installeren

```bash
npm install
```

### Stap 2: Supabase configureren

1. Maak een nieuw Supabase project aan op https://supabase.com
2. Ga naar SQL Editor en voer alle SQL uit uit `supabase-schema.sql`:
   - Dit maakt alle benodigde tabellen aan
   - Stelt Row Level Security in
   - Voegt standaard huishoudens in

3. Maak gebruikers aan in Supabase Auth:
   - **Olivier**: olivier@huishoud.local
     - Wachtwoord: NetjesThuisBeeldstraat
   - **Ashley**: ashley@huishoud.local
     - Wachtwoord: NetjesThuisBeeldstraat
   - **Jan**: jan@huishoud.local
     - Wachtwoord: NetjesThuisRuisstraat
   - **Edna**: edna@huishoud.local
     - Wachtwoord: NetjesThuisBeeldstraatRuisstraat

4. Voeg gebruiker records in via SQL:

```sql
INSERT INTO gebruikers (id, naam, huishouden_ids) VALUES
  ('olivier-uuid-here', 'Olivier', ARRAY['olivier-ashley-household-id']),
  ('ashley-uuid-here', 'Ashley', ARRAY['olivier-ashley-household-id']),
  ('jan-uuid-here', 'Jan', ARRAY['jan-household-id']),
  ('edna-uuid-here', 'Edna', ARRAY['olivier-ashley-household-id', 'jan-household-id']);
```

(Vervang de UUIDs met de echte IDs van de gebruikers en huishoudens)

### Stap 3: Environment variabelen configureren

1. Kopieer `.env.example` naar `.env.local`
2. Vul in:
   - `VITE_SUPABASE_URL`: Je Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Je Supabase anon key (public key)

Je vindt deze in je Supabase project onder Settings > API.

### Stap 4: App starten

```bash
npm run dev
```

De app opent automatisch in je browser op http://localhost:5173

## Projectstructuur

```
huishoud-app/
├── src/
│   ├── components/         # React components
│   │   ├── Layout.jsx     # Hoofd layout met nav
│   │   ├── TaakKaart.jsx  # Task card component
│   │   └── ChipSelect.jsx # Chip selection component
│   ├── context/            # React Context
│   │   └── AuthContext.jsx # Auth state management
│   ├── hooks/              # Custom React hooks
│   │   └── useMobile.jsx  # Responsive breakpoint hook
│   ├── lib/                # Utility functions
│   │   └── supabase.js    # Supabase client setup
│   ├── pages/              # Page components
│   │   ├── Login.jsx      # Login page
│   │   ├── Dashboard.jsx  # Overzicht pagina
│   │   ├── Takenbord.jsx  # Taken management
│   │   ├── Planning.jsx   # Weekly planning
│   │   ├── Boodschappen.jsx # Shopping list
│   │   └── Uren.jsx       # Hours tracking
│   ├── App.jsx            # Root component met routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json
├── .env.example           # Environment variables template
├── .gitignore
└── supabase-schema.sql    # Database schema

```

## Features

- **Gebruikersbeheer**: Login met naam (niet email)
- **Takenbord**: Taak management met status, prioriteit en categories
- **Planning**: Weekly planning grid
- **Boodschappen**: Shopping list met vinkjes
- **Uren**: Track working hours
- **Dashboard**: Statistieken en overzicht
- **Responsive**: Mobile en desktop layouts

## Gebruikers & Toestemmingen

### Olivier
- Huishoudens: 🏠 Olivier & Ashley
- Wachtwoord: NetjesThuisBeeldstraat

### Ashley
- Huishoudens: 🏠 Olivier & Ashley
- Wachtwoord: NetjesThuisBeeldstraat

### Jan
- Huishoudens: 🏡 Jan
- Wachtwoord: NetjesThuisRuisstraat

### Edna
- Huishoudens: 🏠 Olivier & Ashley, 🏡 Jan
- Wachtwoord: NetjesThuisBeeldstraatRuisstraat

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool
- **React Router**: Routing
- **Supabase**: Backend & database
- **CSS**: Inline styles (geen build tools nodig)

## Notes

- Alle tekst is in Nederlands
- Mobile-first design (768px breakpoint)
- Touch targets zijn minimaal 44px
- Color scheme: #1e3a5f (primary), #2d5f8a (secondary)
- Geen TypeScript - zuivere JavaScript + JSX
