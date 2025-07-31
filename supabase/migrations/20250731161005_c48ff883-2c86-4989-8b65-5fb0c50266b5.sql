
-- Ajouter une colonne pour lier les utilisateurs aux organismes de formation
ALTER TABLE profiles ADD COLUMN organisation_id uuid REFERENCES organisations_formation(id);

-- Créer une table pour suivre les documents administratifs des apprenants
CREATE TABLE IF NOT EXISTS public.documents_administratifs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL, -- 'programme', 'reglement', 'cgv', 'convention', 'convocation', 'attestation', 'certificat'
  document_url text,
  is_signed boolean DEFAULT false,
  is_validated boolean DEFAULT false,
  signed_at timestamp with time zone,
  validated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS pour la table documents_administratifs
ALTER TABLE documents_administratifs ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins puissent tout voir et gérer
CREATE POLICY "Admins can manage all documents administratifs"
  ON documents_administratifs
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  ));

-- Politique pour que les utilisateurs puissent voir leurs propres documents
CREATE POLICY "Users can view their own documents administratifs"
  ON documents_administratifs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE TRIGGER update_documents_administratifs_updated_at
  BEFORE UPDATE ON documents_administratifs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ajouter un index pour améliorer les performances
CREATE INDEX idx_documents_administratifs_user_id ON documents_administratifs(user_id);
CREATE INDEX idx_documents_administratifs_type ON documents_administratifs(document_type);
