
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    path VARCHAR(255) NOT NULL
);

CREATE TABLE specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(256) NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    employment_position TEXT NOT NULL,
);

CREATE TABLE user_specializations (
    user_id INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    specialization_id INT REFERENCES specializations (id)  ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT PK_UserSpecialization PRIMARY KEY (user_id, specialization_id)
);

CREATE TABLE staffs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    resume_id INT REFERENCES documents (id) ON UPDATE CASCADE ON DELETE CASCADE, 
    pedagogical_excellence INT NOT NULL,
    progress_plan TEXT NOT NULL
);

CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    achievement_date DATE NOT NULL,
    staff_id INT REFERENCES staffs (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE certificates_documents (
    certificate_id INT REFERENCES certificates (id) ON UPDATE CASCADE ON DELETE CASCADE,
    document_id INT REFERENCES documents (id)  ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT PK_CertificatesDocuments PRIMARY KEY (certificate_id, document_id)
);

CREATE TABLE projects ( 
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    project_date DATE NOT NULL,
    staff_id INT REFERENCES staffs (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE projects_documents (
    project_id INT REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    document_id INT REFERENCES documents (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT PK_ProjectsDocuments PRIMARY KEY (project_id, document_id)
);