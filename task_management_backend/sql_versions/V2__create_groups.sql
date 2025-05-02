CREATE TABLE groups (
                        group_id UUID PRIMARY KEY,
                        group_title VARCHAR(255) NOT NULL,
                        group_description VARCHAR(255) NOT NULL,
                        organisation_id UUID NOT NULL,
                        user_id UUID NOT NULL,
                        created_at TIMESTAMP NOT NULL,
                        updated_at TIMESTAMP NOT NULL
);

CREATE TABLE group_user_assignments (
                                        group_id UUID NOT NULL,
                                        user_id UUID NOT NULL,
                                        PRIMARY KEY (group_id, user_id),
                                        FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
                                        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
