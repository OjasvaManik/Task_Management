-- Add search vectors columns
ALTER TABLE groups ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS groups_search_idx ON groups USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS tasks_search_idx ON tasks USING GIN (search_vector);

-- Create groups search vector update function
CREATE OR REPLACE FUNCTION groups_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
            setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create groups search vector update trigger
DROP TRIGGER IF EXISTS groups_search_vector_update ON groups;
CREATE TRIGGER groups_search_vector_update
    BEFORE INSERT OR UPDATE ON groups
    FOR EACH ROW
EXECUTE FUNCTION groups_search_vector_update();

-- Create tasks search vector update function
CREATE OR REPLACE FUNCTION tasks_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
            setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create tasks search vector update trigger
DROP TRIGGER IF EXISTS tasks_search_vector_update ON tasks;
CREATE TRIGGER tasks_search_vector_update
    BEFORE INSERT OR UPDATE ON tasks
    FOR EACH ROW
EXECUTE FUNCTION tasks_search_vector_update();