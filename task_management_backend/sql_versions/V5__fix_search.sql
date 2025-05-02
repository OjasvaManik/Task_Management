-- Drop old triggers and functions
DROP TRIGGER IF EXISTS groups_search_vector_update ON groups;
DROP FUNCTION IF EXISTS groups_search_vector_update();
DROP TRIGGER IF EXISTS tasks_search_vector_update ON tasks;
DROP FUNCTION IF EXISTS tasks_search_vector_update();

-- Drop old columns
ALTER TABLE groups DROP COLUMN IF EXISTS search_vector;
ALTER TABLE tasks DROP COLUMN IF EXISTS search_vector;

-- Add search vectors columns with correct names
ALTER TABLE groups ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Recreate indexes
DROP INDEX IF EXISTS groups_search_idx;
DROP INDEX IF EXISTS tasks_search_idx;
CREATE INDEX groups_search_idx ON groups USING GIN (search_vector);
CREATE INDEX tasks_search_idx ON tasks USING GIN (search_vector);

-- Create groups search vector update function with correct column names
CREATE OR REPLACE FUNCTION groups_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
            setweight(to_tsvector('english', coalesce(NEW.group_title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.group_description, '')), 'B');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create groups search vector update trigger
CREATE TRIGGER groups_search_vector_update
    BEFORE INSERT OR UPDATE ON groups
    FOR EACH ROW
EXECUTE FUNCTION groups_search_vector_update();

-- Create tasks search vector update function with correct column names
CREATE OR REPLACE FUNCTION tasks_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
            setweight(to_tsvector('english', coalesce(NEW.task_title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.task_description, '')), 'B');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create tasks search vector update trigger
CREATE TRIGGER tasks_search_vector_update
    BEFORE INSERT OR UPDATE ON tasks
    FOR EACH ROW
EXECUTE FUNCTION tasks_search_vector_update();