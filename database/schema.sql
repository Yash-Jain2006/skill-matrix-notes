---------- EXTENSIONS ----------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
---------- TABLES ----------
CREATE TABLE public.notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL CHECK (
        char_length(title) BETWEEN 1 AND 255
    ),
    description TEXT CHECK (char_length(description) <= 2000),
    college TEXT NOT NULL CHECK (
        char_length(college) BETWEEN 1 AND 255
    ),
    stream TEXT NOT NULL CHECK (
        char_length(stream) BETWEEN 1 AND 255
    ),
    branch TEXT NOT NULL CHECK (
        char_length(branch) BETWEEN 1 AND 255
    ),
    semester SMALLINT NOT NULL CHECK (
        semester BETWEEN 1 AND 10
    ),
    subject TEXT NOT NULL CHECK (
        char_length(subject) BETWEEN 1 AND 255
    ),
    file_url TEXT NOT NULL CHECK (char_length(file_url) <= 1000),
    is_public BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);
---------- INDEXES ----------
CREATE INDEX idx_notes_hierarchy ON public.notes(college, stream, branch, semester, subject);
CREATE INDEX idx_notes_user_created ON public.notes(user_id, created_at DESC);
CREATE INDEX idx_notes_subject_created ON public.notes(subject, created_at DESC);
CREATE INDEX idx_notes_public_created ON public.notes(created_at DESC)
WHERE is_public = true;
---------- AUTO-UPDATE TRIGGER ----------
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = timezone('utc', now());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_notes_updated_at BEFORE
UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
---------- ROW LEVEL SECURITY (NOTES) ----------
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read notes" ON public.notes FOR
SELECT USING (is_public = true);
CREATE POLICY "Authenticated users insert notes" ON public.notes FOR
INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND auth.uid() = user_id
    );
CREATE POLICY "Users update own notes" ON public.notes FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);
---------- ROW LEVEL SECURITY (STORAGE BUCKET) ----------
-- Setup bucket with 50MB file restrictions
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('notes-files', 'notes-files', false, 52428800) ON CONFLICT (id) DO
UPDATE
SET file_size_limit = 52428800;
CREATE POLICY "Authenticated read files" ON storage.objects FOR
SELECT USING (
        bucket_id = 'notes-files'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Users upload to own folder" ON storage.objects FOR
INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND bucket_id = 'notes-files'
        AND (storage.foldername(name)) [1] = auth.uid()::text
    );