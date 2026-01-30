-- Schéma de base de données pour DocTerra

-- Table des Documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID,
    title TEXT,
    query TEXT,
    status TEXT DEFAULT 'draft',
    metadata JSONB
);

-- Table des Sources (Résultats de DocScout)
CREATE TABLE public.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT,
    url TEXT,
    source_type TEXT, -- 'web', 'pdf', 'docx', 'manual'
    content TEXT,
    status TEXT DEFAULT 'analysed'
);

-- Table des Sections du Rapport
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT,
    content TEXT,
    sort_order INTEGER,
    brief TEXT
);

-- RLS (Row Level Security) - Optionnel pour le moment
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
