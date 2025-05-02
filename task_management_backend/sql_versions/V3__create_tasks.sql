CREATE TABLE tasks (
                       task_id UUID PRIMARY KEY,
                       task_title VARCHAR(255) NOT NULL,
                       task_description TEXT NOT NULL,
                       task_status VARCHAR(50) NOT NULL,
                       task_due_date TIMESTAMP NOT NULL,
                       user_id UUID NOT NULL,
                       group_id UUID NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(user_id),
                       FOREIGN KEY (group_id) REFERENCES groups(group_id)
);