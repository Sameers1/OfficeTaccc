-- Supabase Database Backup
-- This file contains all necessary SQL to recreate the database structure
-- Run this in your Supabase SQL editor to restore the database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Drop existing objects (if they exist)
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS user_organizations CASCADE;
DROP TABLE IF EXISTS task_assignments CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS task_attachments CASCADE;
DROP TABLE IF EXISTS task_history CASCADE;
DROP TABLE IF EXISTS task_labels CASCADE;
DROP TABLE IF EXISTS task_label_assignments CASCADE;
DROP TABLE IF EXISTS task_dependencies CASCADE;
DROP TABLE IF EXISTS task_checklists CASCADE;
DROP TABLE IF EXISTS task_checklist_items CASCADE;
DROP TABLE IF EXISTS task_reminders CASCADE;
DROP TABLE IF EXISTS task_recurrences CASCADE;
DROP TABLE IF EXISTS task_custom_fields CASCADE;
DROP TABLE IF EXISTS task_custom_field_values CASCADE;
DROP TABLE IF EXISTS task_templates CASCADE;
DROP TABLE IF EXISTS task_template_fields CASCADE;
DROP TABLE IF EXISTS task_template_field_values CASCADE;
DROP TABLE IF EXISTS task_template_assignments CASCADE;
DROP TABLE IF EXISTS task_template_dependencies CASCADE;
DROP TABLE IF EXISTS task_template_labels CASCADE;
DROP TABLE IF EXISTS task_template_label_assignments CASCADE;
DROP TABLE IF EXISTS task_template_checklists CASCADE;
DROP TABLE IF EXISTS task_template_checklist_items CASCADE;
DROP TABLE IF EXISTS task_template_reminders CASCADE;
DROP TABLE IF EXISTS task_template_recurrences CASCADE;
DROP TABLE IF EXISTS task_template_custom_fields CASCADE;
DROP TABLE IF EXISTS task_template_custom_field_values CASCADE;
DROP TABLE IF EXISTS task_template_attachments CASCADE;
DROP TABLE IF EXISTS task_template_comments CASCADE;
DROP TABLE IF EXISTS task_template_history CASCADE;
DROP TABLE IF EXISTS task_template_assignments CASCADE;
DROP TABLE IF EXISTS task_template_dependencies CASCADE;
DROP TABLE IF EXISTS task_template_labels CASCADE;
DROP TABLE IF EXISTS task_template_label_assignments CASCADE;
DROP TABLE IF EXISTS task_template_checklists CASCADE;
DROP TABLE IF EXISTS task_template_checklist_items CASCADE;
DROP TABLE IF EXISTS task_template_reminders CASCADE;
DROP TABLE IF EXISTS task_template_recurrences CASCADE;
DROP TABLE IF EXISTS task_template_custom_fields CASCADE;
DROP TABLE IF EXISTS task_template_custom_field_values CASCADE;
DROP TABLE IF EXISTS task_template_attachments CASCADE;
DROP TABLE IF EXISTS task_template_comments CASCADE;
DROP TABLE IF EXISTS task_template_history CASCADE;

-- Create tables
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('Shipment', 'Invoice', 'Payment', 'Custom')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Shipment specific fields
    origin TEXT,
    destination TEXT,
    shipment_type TEXT CHECK (shipment_type IN ('Air', 'Sea', 'Land')),
    weight TEXT,
    -- Invoice specific fields
    amount TEXT,
    client_name TEXT,
    invoice_number TEXT,
    -- Payment specific fields
    payment_method TEXT CHECK (payment_method IN ('Credit Card', 'Bank Transfer', 'Cash')),
    reference TEXT
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Organizations are viewable by users who are members"
    ON organizations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = organizations.id
            AND user_organizations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create organizations"
    ON organizations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own organizations"
    ON organizations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = organizations.id
            AND user_organizations.user_id = auth.uid()
            AND user_organizations.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete their own organizations"
    ON organizations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = organizations.id
            AND user_organizations.user_id = auth.uid()
            AND user_organizations.role = 'owner'
        )
    );

CREATE POLICY "User organizations are viewable by users who are members"
    ON user_organizations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations uo
            WHERE uo.organization_id = user_organizations.organization_id
            AND uo.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create user organizations"
    ON user_organizations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = user_organizations.organization_id
            AND user_organizations.user_id = auth.uid()
            AND user_organizations.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can update their own user organizations"
    ON user_organizations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = user_organizations.organization_id
            AND user_organizations.user_id = auth.uid()
            AND user_organizations.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete their own user organizations"
    ON user_organizations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = user_organizations.organization_id
            AND user_organizations.user_id = auth.uid()
            AND user_organizations.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Tasks are viewable by users who are members of the organization"
    ON tasks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = tasks.organization_id
            AND user_organizations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create tasks in their organizations"
    ON tasks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = tasks.organization_id
            AND user_organizations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks in their organizations"
    ON tasks FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = tasks.organization_id
            AND user_organizations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks in their organizations"
    ON tasks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_organizations.organization_id = tasks.organization_id
            AND user_organizations.user_id = auth.uid()
        )
    );

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_organizations_updated_at
    BEFORE UPDATE ON user_organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default organization
INSERT INTO organizations (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Organization');

-- Insert test task
INSERT INTO tasks (
    title,
    description,
    type,
    status,
    priority,
    due_date,
    organization_id,
    created_by
) VALUES (
    'Test Task',
    'This is a test task',
    'Custom',
    'pending',
    'medium',
    NOW() + INTERVAL '7 days',
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000'
); 