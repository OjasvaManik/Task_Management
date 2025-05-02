CREATE TABLE organisations (
                               organisation_id UUID PRIMARY KEY,
                               organisation_name VARCHAR(255) NOT NULL UNIQUE,
                               organisation_email VARCHAR(255) NOT NULL UNIQUE,
                               created_at TIMESTAMP NOT NULL,
                               updated_at TIMESTAMP NOT NULL
);

CREATE TABLE users (
                       user_id UUID PRIMARY KEY,
                       user_name VARCHAR(255) NOT NULL UNIQUE,
                       name VARCHAR(255),
                       email VARCHAR(255) NOT NULL UNIQUE,
                       user_password VARCHAR(255) NOT NULL,
                       role VARCHAR(255) NOT NULL,
                       is_banned BOOLEAN NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,
                       organisation_id UUID NOT NULL
);