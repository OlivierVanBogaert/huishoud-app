-- Create tables for Huishoud Van Bogaert app

-- Huishoudens (Households)
CREATE TABLE huishoudens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gebruikers (Users)
CREATE TABLE gebruikers (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  naam TEXT NOT NULL,
  huishouden_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Taken (Tasks)
CREATE TABLE taken (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taak TEXT NOT NULL,
  huis_id UUID NOT NULL REFERENCES huishoudens(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'bezig', 'klaar')),
  prioriteit TEXT NOT NULL DEFAULT 'normaal' CHECK (prioriteit IN ('hoog', 'normaal', 'laag')),
  persoon TEXT,
  categorie TEXT,
  datum DATE,
  foto_url TEXT,
  herhaling TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reacties (Comments/Reactions on tasks)
CREATE TABLE reacties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taak_id UUID NOT NULL REFERENCES taken(id) ON DELETE CASCADE,
  van TEXT NOT NULL,
  tekst TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blokken (Planning blocks)
CREATE TABLE blokken (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dag DATE NOT NULL,
  blok TEXT NOT NULL,
  huis_id UUID NOT NULL REFERENCES huishoudens(id) ON DELETE CASCADE,
  tijdslot TEXT NOT NULL CHECK (tijdslot IN ('Ochtend', 'Namiddag', 'Hele dag')),
  gebruiker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Boodschappen (Shopping list)
CREATE TABLE boodschappen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item TEXT NOT NULL,
  huis_id UUID NOT NULL REFERENCES huishoudens(id) ON DELETE CASCADE,
  gedaan BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Uren (Hours tracking)
CREATE TABLE uren (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gebruiker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  datum DATE NOT NULL,
  start_tijd TIME NOT NULL,
  einde_tijd TIME NOT NULL,
  pauze_minuten INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meldingen (Notifications)
CREATE TABLE meldingen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tekst TEXT NOT NULL,
  voor_gebruiker UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gelezen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_taken_huis_id ON taken(huis_id);
CREATE INDEX idx_taken_status ON taken(status);
CREATE INDEX idx_taken_datum ON taken(datum);
CREATE INDEX idx_reacties_taak_id ON reacties(taak_id);
CREATE INDEX idx_blokken_huis_id ON blokken(huis_id);
CREATE INDEX idx_blokken_dag ON blokken(dag);
CREATE INDEX idx_boodschappen_huis_id ON boodschappen(huis_id);
CREATE INDEX idx_boodschappen_gedaan ON boodschappen(gedaan);
CREATE INDEX idx_uren_gebruiker_id ON uren(gebruiker_id);
CREATE INDEX idx_uren_datum ON uren(datum);
CREATE INDEX idx_meldingen_voor_gebruiker ON meldingen(voor_gebruiker);
CREATE INDEX idx_meldingen_gelezen ON meldingen(gelezen);

-- Enable Row Level Security
ALTER TABLE huishoudens ENABLE ROW LEVEL SECURITY;
ALTER TABLE gebruikers ENABLE ROW LEVEL SECURITY;
ALTER TABLE taken ENABLE ROW LEVEL SECURITY;
ALTER TABLE reacties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blokken ENABLE ROW LEVEL SECURITY;
ALTER TABLE boodschappen ENABLE ROW LEVEL SECURITY;
ALTER TABLE uren ENABLE ROW LEVEL SECURITY;
ALTER TABLE meldingen ENABLE ROW LEVEL SECURITY;

-- RLS Policies for huishoudens
CREATE POLICY "Gebruikers kunnen hun huishoudens zien"
  ON huishoudens FOR SELECT
  USING (id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid())));

-- RLS Policies for gebruikers
CREATE POLICY "Gebruikers kunnen hun eigen profiel zien"
  ON gebruikers FOR SELECT
  USING (id = auth.uid());

-- RLS Policies for taken
CREATE POLICY "Gebruikers kunnen taken van hun huishoudens zien"
  ON taken FOR SELECT
  USING (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

CREATE POLICY "Gebruikers kunnen taken toevoegen aan hun huishoudens"
  ON taken FOR INSERT
  WITH CHECK (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

CREATE POLICY "Gebruikers kunnen taken van hun huishoudens updaten"
  ON taken FOR UPDATE
  USING (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

-- RLS Policies for reacties
CREATE POLICY "Gebruikers kunnen reacties van hun huishoudens zien"
  ON reacties FOR SELECT
  USING (
    taak_id IN (SELECT id FROM taken WHERE huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid())))
  );

CREATE POLICY "Gebruikers kunnen reacties toevoegen"
  ON reacties FOR INSERT
  WITH CHECK (
    taak_id IN (SELECT id FROM taken WHERE huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid())))
  );

-- RLS Policies for blokken
CREATE POLICY "Gebruikers kunnen blokken van hun huishoudens zien"
  ON blokken FOR SELECT
  USING (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

CREATE POLICY "Gebruikers kunnen blokken toevoegen aan hun huishoudens"
  ON blokken FOR INSERT
  WITH CHECK (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

-- RLS Policies for boodschappen
CREATE POLICY "Gebruikers kunnen boodschappen van hun huishoudens zien"
  ON boodschappen FOR SELECT
  USING (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

CREATE POLICY "Gebruikers kunnen boodschappen toevoegen aan hun huishoudens"
  ON boodschappen FOR INSERT
  WITH CHECK (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

CREATE POLICY "Gebruikers kunnen boodschappen van hun huishoudens updaten"
  ON boodschappen FOR UPDATE
  USING (
    huis_id::text = ANY((SELECT huishouden_ids FROM gebruikers WHERE id = auth.uid()))
  );

-- RLS Policies for uren
CREATE POLICY "Gebruikers kunnen hun eigen uren zien"
  ON uren FOR SELECT
  USING (gebruiker_id = auth.uid());

CREATE POLICY "Gebruikers kunnen uren toevoegen"
  ON uren FOR INSERT
  WITH CHECK (gebruiker_id = auth.uid());

CREATE POLICY "Gebruikers kunnen hun eigen uren updaten"
  ON uren FOR UPDATE
  USING (gebruiker_id = auth.uid());

-- RLS Policies for meldingen
CREATE POLICY "Gebruikers kunnen hun eigen meldingen zien"
  ON meldingen FOR SELECT
  USING (voor_gebruiker = auth.uid());

-- Insert default households
INSERT INTO huishoudens (naam) VALUES
  ('🏠 Olivier & Ashley'),
  ('🏡 Jan');

-- These users will be created via Supabase Auth with the credentials specified
-- And then their records should be inserted here with the appropriate huishouden_ids
