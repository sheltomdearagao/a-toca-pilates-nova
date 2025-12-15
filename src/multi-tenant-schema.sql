-- Criação das tabelas de organização
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- Tabelas de negócio com coluna organization_id
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_type TEXT,
  plan_frequency TEXT,
  payment_method TEXT,
  monthly_fee NUMERIC,
  enrollment_type TEXT NOT NULL DEFAULT 'Particular',
  date_of_birth TEXT,
  validity_date TEXT,
  preferred_days TEXT[],
  preferred_time TEXT,
  address TEXT,
  guardian_phone TEXT,
  discount_description TEXT,
  due_day INTEGER,
  reposition_credits INTEGER DEFAULT 0,
  last_credit_renewal TEXT
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  frequency INTEGER,
  default_price NUMERIC,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  student_id UUID NOT NULL REFERENCES students(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  price NUMERIC,
  frequency INTEGER,
  start_date TEXT,
  end_date TEXT,
  due_day INTEGER,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  student_id UUID REFERENCES students(id),
  description TEXT,
  category TEXT,
  amount NUMERIC,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  status TEXT NOT NULL CHECK (status IN ('Pago', 'Pendente', 'Atrasado')),
  due_date TEXT,
  paid_at TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT,
  start_time TEXT,
  duration_minutes INTEGER,
  notes TEXT,
  student_id UUID REFERENCES students(id),
  recurring_class_template_id UUID REFERENCES recurring_class_templates(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE class_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  student_id UUID NOT NULL REFERENCES students(id),
  status TEXT NOT NULL CHECK (status IN ('Agendado', 'Presente', 'Faltou')),
  attendance_type TEXT NOT NULL CHECK (attendance_type IN ('Recorrente', 'Pontual', 'Experimental', 'Reposicao')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recurring_class_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  student_id UUID REFERENCES students(id),
  title TEXT,
  duration_minutes INTEGER,
  notes TEXT,
  recurrence_pattern JSONB,
  recurrence_start_date TEXT,
  recurrence_end_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gatilho de auto-onboarding
CREATE OR REPLACE FUNCTION create_organization_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO organizations (name, slug, owner_id)
  VALUES (
    'Estúdio de ' || COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuário') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    LOWER(REPLACE(
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'usuario') || 
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''), 
      ' ', ''
    )) || '-' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 8),
    NEW.id
  );
  
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (
    (SELECT id FROM organizations WHERE owner_id = NEW.id),
    NEW.id,
    'admin'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_organization_on_signup();