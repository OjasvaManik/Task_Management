-- Update existing records with search vectors
UPDATE groups SET search_vector =
                      setweight(to_tsvector('english', coalesce(group_title, '')), 'A') ||
                      setweight(to_tsvector('english', coalesce(group_description, '')), 'B');

UPDATE tasks SET search_vector =
                     setweight(to_tsvector('english', coalesce(task_title, '')), 'A') ||
                     setweight(to_tsvector('english', coalesce(task_description, '')), 'B');