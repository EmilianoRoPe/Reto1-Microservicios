CREATE TABLE IF NOT EXISTS startups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    foundedAt DATE,
    location VARCHAR(100),
    category VARCHAR(50),
    fundingAmount NUMERIC
);
CREATE TABLE IF NOT EXISTS technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    description TEXT,
    adoptionLevel VARCHAR(50)
);

INSERT INTO startups (name, foundedAt, location, category, fundingAmount)
VALUES ('TechStars', '2020-01-01', 'CDMX', 'FinTech', 1000000)
ON CONFLICT DO NOTHING;

INSERT INTO technologies (name, sector, description, adoptionLevel)
VALUES ('Blockchain', 'Finance', 'Distributed ledger', 'High')
ON CONFLICT DO NOTHING;
