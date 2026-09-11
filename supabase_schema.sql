-- ==========================================================================
-- శ్రీ లక్ష్మీ గణపతి స్వామి – వినాయక చవితి ఉత్సవాలు 2026
-- Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu
-- Complete Supabase Database Schema, RLS Security Policies & Seed Data
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. TABLE: site_settings
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    website_name TEXT NOT NULL DEFAULT 'శ్రీ లక్ష్మీ గణపతి స్వామి – వినాయక చవితి ఉత్సవాలు 2026',
    committee_name TEXT NOT NULL DEFAULT 'Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu',
    location TEXT NOT NULL DEFAULT 'Gandhibomma Center, Velivennu',
    hero_title TEXT NOT NULL DEFAULT 'శ్రీ లక్ష్మీ గణపతి స్వామి',
    hero_subtitle TEXT NOT NULL DEFAULT 'వినాయక చవితి ఉత్సవాలు 2026',
    homepage_description TEXT NOT NULL DEFAULT 'శ్రీ లక్ష్మీ గణపతి స్వామి వారి సన్నిధిలో వినాయక చవితి ఉత్సవాలను భక్తిశ్రద్ధలతో నిర్వహించబడును. గాంధీబొమ్మ సెంటర్, వెలివెన్ను నందు ప్రతి సంవత్సరం నిర్వహించబడే ఈ వార్షిక వేడుకలలో గ్రామస్తులు మరియు భక్తులందరూ పాల్గొని స్వామివారి దివ్య కృపాకటాక్షాలను పొందగలరు.',
    countdown_date TIMESTAMPTZ NOT NULL DEFAULT '2026-09-14 06:00:00+05:30',
    music_url TEXT DEFAULT 'audio/devotional.mp3',
    announcement TEXT DEFAULT 'శ్రీ లక్ష్మీ గణపతి స్వామి వారి 2026 వినాయక చవితి మహోత్సవాలకు భక్తులందరికీ సాదర సుస్వాగతం.',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- --------------------------------------------------------------------------
-- 2. TABLE: daily_pooja
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_pooja (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    time TEXT NOT NULL,
    description TEXT,
    special_info TEXT,
    is_today BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 3. TABLE: pooja_vidhanam
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pooja_vidhanam (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    materials TEXT,
    step_number INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 4. TABLE: gallery
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year TEXT NOT NULL, -- e.g. '1980', '1998', '2026' (Supports 1980 onward)
    filename TEXT NOT NULL, -- e.g. 'ganapathi-1998-01.jpg'
    caption TEXT NOT NULL, -- e.g. 'వినాయక చవితి ఉత్సవాలు - 1998'
    title TEXT,
    description TEXT,
    media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    backup_required BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 5. TABLE: dharma_samskruthi
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dharma_samskruthi (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_pooja ENABLE ROW LEVEL SECURITY;
ALTER TABLE pooja_vidhanam ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE dharma_samskruthi ENABLE ROW LEVEL SECURITY;

-- 6.1 site_settings Policies
CREATE POLICY "Public can view site settings"
    ON site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admin can update site settings"
    ON site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.2 daily_pooja Policies
CREATE POLICY "Public can view published daily pooja"
    ON daily_pooja FOR SELECT
    USING (published = true);

CREATE POLICY "Admin can manage daily pooja"
    ON daily_pooja FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.3 pooja_vidhanam Policies
CREATE POLICY "Public can view published pooja vidhanam"
    ON pooja_vidhanam FOR SELECT
    USING (published = true);

CREATE POLICY "Admin can manage pooja vidhanam"
    ON pooja_vidhanam FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.4 gallery Policies
CREATE POLICY "Public can view published gallery items"
    ON gallery FOR SELECT
    USING (published = true);

CREATE POLICY "Admin can manage gallery"
    ON gallery FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.5 dharma_samskruthi Policies
CREATE POLICY "Public can view published dharma articles"
    ON dharma_samskruthi FOR SELECT
    USING (published = true);

CREATE POLICY "Admin can manage dharma articles"
    ON dharma_samskruthi FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- --------------------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKETS & POLICIES
-- --------------------------------------------------------------------------
-- Create buckets if not present
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('gallery', 'gallery', true),
    ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view files from both buckets
CREATE POLICY "Public can view gallery files"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('gallery', 'site-assets'));

-- Authenticated Admin can upload/update/delete files
CREATE POLICY "Admin can upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('gallery', 'site-assets'));

CREATE POLICY "Admin can update files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id IN ('gallery', 'site-assets'));

CREATE POLICY "Admin can delete files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id IN ('gallery', 'site-assets'));

-- --------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- --------------------------------------------------------------------------
-- Seed site_settings
INSERT INTO site_settings (id, website_name, committee_name, location, hero_title, hero_subtitle, homepage_description, countdown_date, music_url, announcement)
VALUES (
    1,
    'శ్రీ లక్ష్మీ గణపతి స్వామి – వినాయక చవితి ఉత్సవాలు 2026',
    'Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu',
    'Gandhibomma Center, Velivennu',
    'శ్రీ లక్ష్మీ గణపతి స్వామి',
    'వినాయక చవితి ఉత్సవాలు 2026',
    'శ్రీ లక్ష్మీ గణపతి స్వామి వారి సన్నిధిలో వినాయక చవితి ఉత్సవాలను భక్తిశ్రద్ధలతో నిర్వహించబడును. గాంధీబొమ్మ సెంటర్, వెలివెన్ను నందు ప్రతి సంవత్సరం నిర్వహించబడే ఈ వార్షిక వేడుకలలో గ్రామస్తులు మరియు భక్తులందరూ పాల్గొని స్వామివారి దివ్య కృపాకటాక్షాలను పొందగలరు.',
    '2026-09-14 06:00:00+05:30',
    'assets/music/devotional.mp3',
    'శ్రీ లక్ష్మీ గణపతి స్వామి వారి 2026 వినాయక చవితి మహోత్సవాలకు భక్తులందరికీ సాదర సుస్వాగతం.'
) ON CONFLICT (id) DO NOTHING;

-- Seed daily_pooja
INSERT INTO daily_pooja (date, title, time, description, special_info, is_today, published, display_order)
VALUES 
    ('2026-09-14', 'వినాయక విగ్రహ ప్రతిష్ఠాపన & గణపతి హోమం', 'ఉదయం 06:00 గం॥', 'మంగళవాయిద్యాలతో కలశ స్థాపన, ప్రాణప్రతిష్ఠాపన మరియు స్వామివారి నూతన విగ్రహ ప్రథమ దర్శనం.', 'తీర్థ ప్రసాద వితరణ', true, true, 1),
    ('2026-09-15', 'లక్ష్మీ గణపతి విశేష అభిషేకం', 'ఉదయం 07:30 గం॥', 'పంచామృతాలతో విశేష అభిషేకం మరియు సహస్ర నామార్చన.', 'సమయం: త్వరలో', false, true, 2),
    ('2026-09-16', 'కుంకుమార్చన & లలితా పారాయణం', 'సాయంత్రం 06:30 గం॥', 'మహిళా భక్తులచే సామూహిక కుంకుమార్చన మరియు దీపారాధన పూజ.', 'సమయం: త్వరలో', false, true, 3),
    ('2026-09-17', 'భజన సంధ్యా & సంకీర్తన', 'సాయంత్రం 07:00 గం॥', 'భజన మండలి వారిచే భక్తి సంకీర్తనలు మరియు భక్తి గీతాలాపన.', 'సమయం: త్వరలో', false, true, 4),
    ('2026-09-24', 'మహా గణేష్ ఉరేగింపు & నిమజ్జనోత్సవం', 'సాయంత్రం 04:00 గం॥', 'మేళతాళాలు, కోలాటాలు, సాంస్కృతిక వేడుకలతో భవ్య శోభాయాత్ర.', 'మహా అన్నదానం అనంతరం', false, true, 5);

-- Seed pooja_vidhanam
INSERT INTO pooja_vidhanam (title, content, materials, step_number, published)
VALUES 
    ('పూజా సామగ్రి', 'వినాయక చవితి పూజకు అవసరమైన సంపూర్ణ పవిత్ర సామగ్రి జాబితా.', 'పసుపు, కుంకుమ, గంధం, అక్షతలు\nమట్టి వినాయక ప్రతిమ\nమారేడు, మాచీపత్రం, తులసి, గరికతో కూడిన 21 రకాల పత్రులు\nసువాసన గల పూలు మరియు పూలమాలలు\nదీపాలు, ఆవు నెయ్యి, వత్తులు, అగరుబత్తులు, కర్పూరం\nతాంబూలం (ఆకులు, వక్కలు, అరటిపండ్లు, నాణేలు)\nనైవేద్యం: బెల్లం, కొబ్బరికాయలు, కుడుములు, మోదకాలు, పాయసం\nకలశం కొరకు చిన్న చెంబు, కొబ్బరికాయ మరియు మామిడి ఆకులు', 0, true),
    ('పూజా స్థలాన్ని సిద్ధం చేయడం', 'పూజా గది లేదా వినాయక మండపాన్ని శుభ్రపరిచి, పవిత్ర జలంతో ప్రోక్షించి, బియ్యపు పిండితో ముగ్గులు వేసి, ఒక పీటపై ఎర్రటి లేదా పసుపు రంగు వస్త్రం పరవాలి.', '', 1, true),
    ('గణపతి ప్రతిష్ఠాపన', 'మట్టితో చేసిన వినాయక ప్రతిమను పీటపై ప్రతిష్ఠించి, పసుపు గణపతిని తయారుచేసి ముందుగా తమలపాకుపై ఉంచాలి.', '', 2, true),
    ('దీపారాధన & ఆచమనం', 'దీపాలు వెలిగించి, నమస్కరించి, ఆచమనం చేసి మనస్సును, శరీరాన్ని పవిత్రం చేసుకోవాలి.', '', 3, true),
    ('సంకల్పం', 'సకుటుంబంగా ఆయురారోగ్యాలు, సుఖశాంతులు, విఘ్న నివారణ కలగాలని భక్తితో సంకల్పం చెప్పుకోవాలి.', '', 4, true),
    ('షోడశోపచార పూజ & ఏకవింశతి పత్రి పూజ', 'స్వామివారికి ఆసనం, పాద్యం, అర్ఘ్యం, స్నానం, వస్త్రం సమర్పించి, 21 రకాల పవిత్ర పత్రులతో పూజించాలి.', '', 5, true),
    ('నైవేద్య సమర్పణ', 'స్వామివారికి అత్యంత ప్రీతిపాత్రమైన మోదకాలు, కుడుములు, పండ్లు, కొబ్బరికాయలను భక్తితో నివేదించాలి.', '', 6, true),
    ('మంగళ హారతి & ప్రార్థన', 'కర్పూర నీరాజనం ఇచ్చి, ప్రదక్షిణ నమస్కారాలు చేసి స్వామివారి తీర్థ ప్రసాదాలను స్వీకరించాలి.', '', 7, true);

-- Note: Gallery is managed dynamically via Supabase & Admin Panel (supports 1980 onward).
-- No placeholder or demo rows seeded to maintain clean primary gallery storage.

-- Seed dharma_samskruthi
INSERT INTO dharma_samskruthi (title, category, content, image_url, published)
VALUES 
    ('దేవాలయాల ప్రాముఖ్యత', 'హిందూ ధర్మం', 'దేవాలయాలు కేవలం పూజా స్థలాలు మాత్రమే కాదు; మానసిక ప్రశాంతతను, సానుకూల ఆధ్యాత్మిక తరంగాలను అందిస్తూ సమాజ ఐక్యతను నిలిపే పవిత్ర కేంద్రాలు.', 'images/hero.jpg', true),
    ('దీపారాధన పరమార్థం', 'పూజా సంప్రదాయాలు', 'దీపం పరబ్రహ్మ స్వరూపం. అజ్ఞానమనే అంధకారాన్ని పారద్రోలి జ్ఞాన వెలుగును నింపే పవిత్ర సంప్రదాయం దీపారాధన. నిత్య దీపారాధన ద్వారా ఇంట్లో సకల దోషాలు నివారణమై శుభాలు కలుగుతాయి.', 'images/history/vinayaka_puja.jpg', true),
    ('ప్రకృతితో మన అనుబంధం - మట్టి గణపతి', 'సనాతన సంప్రదాయాలు', 'వినాయకుని మట్టితో తయారుచేసి, ఔషధ గుణాలున్న 21 పత్రులతో పూజించి తిరిగి జలంలో నిమజ్జనం చేయడం ద్వారా సృష్టి, స్థితి, లయల ప్రకృతి ధర్మాన్ని మనం గౌరవిస్తాము.', 'images/idols/idol_2024.jpg', true),
    ('భారతీయ సంస్కృతి & సనాతన ధర్మ విలువలు', 'హిందూ సంస్కృతి', '"వసుధైవ కుటుంబకం" - ప్రపంచమంతా ఒకే కుటుంబం అనే సత్యం, ధర్మం, శాంతి, సేవా భావాలను మన సనాతన సంస్కృతి తరతరాలుగా బోధిస్తోంది.', 'images/yatra/procession_grand.jpg', true);
