-- Création des tables pour le système OF complet

-- Table pour les inscriptions avec signature électronique
CREATE TABLE public.inscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected', 'completed')),
  signature_data TEXT, -- Données de la signature électronique
  signature_ip TEXT,
  signature_timestamp TIMESTAMP WITH TIME ZONE,
  convention_signed BOOLEAN DEFAULT false,
  documents_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les documents OF (programme, règlement, CGV, etc.)
CREATE TABLE public.documents_of (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('programme', 'reglement', 'cgv', 'convention', 'convocation', 'attestation', 'certificat')),
  title TEXT NOT NULL,
  content TEXT, -- Contenu du document ou template
  file_url TEXT, -- URL du fichier PDF généré
  is_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'émargement digital
CREATE TABLE public.emargements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  session_date DATE NOT NULL,
  session_start_time TIME NOT NULL,
  session_end_time TIME NOT NULL,
  signature_data TEXT, -- Signature numérique de présence
  signature_timestamp TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  is_present BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les tests de positionnement et évaluations
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('positionnement', 'final', 'satisfaction')),
  questions JSONB, -- Questions et réponses
  score INTEGER,
  max_score INTEGER,
  percentage DECIMAL(5,2),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour le suivi des envois automatiques
CREATE TABLE public.automatic_mailings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inscription_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('programme', 'reglement', 'cgv', 'convocation', 'satisfaction', 'relance')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_email TEXT NOT NULL,
  content TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les organisations de formation (OF)
CREATE TABLE public.organisations_formation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  siret TEXT,
  numero_declaration TEXT, -- Numéro de déclaration d'activité
  qualiopi_certified BOOLEAN DEFAULT false,
  settings JSONB, -- Paramètres personnalisables
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insertion d'une OF par défaut
INSERT INTO public.organisations_formation (name, email) 
VALUES ('Mon Organisme de Formation', 'contact@monof.fr');

-- Enable RLS sur toutes les tables
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_of ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emargements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automatic_mailings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations_formation ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour inscriptions
CREATE POLICY "Users can view their own inscriptions" 
ON public.inscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inscriptions" 
ON public.inscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and instructors can view all inscriptions" 
ON public.inscriptions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'instructor')
  )
);

-- Politiques RLS pour documents_of (lisibles par tous les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can view active documents" 
ON public.documents_of 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Admins can manage documents" 
ON public.documents_of 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Politiques RLS pour émargements
CREATE POLICY "Users can view their own emargements" 
ON public.emargements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emargements" 
ON public.emargements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Instructors can view course emargements" 
ON public.emargements 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.courses c ON c.instructor_id = p.id
    WHERE p.id = auth.uid() 
    AND c.id = emargements.course_id
    AND p.role = 'instructor'
  )
);

-- Politiques RLS pour évaluations
CREATE POLICY "Users can view their own evaluations" 
ON public.evaluations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create and update their own evaluations" 
ON public.evaluations 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view course evaluations" 
ON public.evaluations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.courses c ON c.instructor_id = p.id
    WHERE p.id = auth.uid() 
    AND c.id = evaluations.course_id
    AND p.role = 'instructor'
  )
);

-- Politiques pour automatic_mailings (admins seulement)
CREATE POLICY "Admins can manage automatic mailings" 
ON public.automatic_mailings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Politiques pour organisations_formation (lisible par tous, modifiable par admins)
CREATE POLICY "Everyone can view active OF" 
ON public.organisations_formation 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage OF" 
ON public.organisations_formation 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Triggers pour updated_at
CREATE TRIGGER update_inscriptions_updated_at
BEFORE UPDATE ON public.inscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_of_updated_at
BEFORE UPDATE ON public.documents_of
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emargements_updated_at
BEFORE UPDATE ON public.emargements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organisations_formation_updated_at
BEFORE UPDATE ON public.organisations_formation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();