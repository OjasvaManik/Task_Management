UPDATE organisations SET organisation_secret_code = 'default_secret_code'
WHERE organisation_secret_code IS NULL;

ALTER TABLE organisations
ALTER COLUMN organisation_secret_code SET NOT NULL;