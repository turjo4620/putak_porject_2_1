

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    last_login TIMESTAMP
);

CREATE TABLE customer (
    user_id BIGINT PRIMARY KEY,
    newsletter_opt_in BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE admin (
    user_id BIGINT PRIMARY KEY,
    admin_level VARCHAR(50),
    department VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users (user_id, name, email, phone_number, password_hash, role, status, last_login) VALUES
(1786230010, 'Rahim Ahmed', 'rahim.ahmed1@example.com', '01753464097', '$2b$12$/GhL6Gg7yl1Ncty1Fhx1eegYMtf7MYfhzMcabg1XqacH/CKO1ze5G', 'customer', 'Active', '2026-02-26 01:50:15.816107'),
(1786230142, 'Karim Islam', 'karim.islam2@example.com', '01716480894', '$2b$12$GusA/s2oyJ6CtH28j/K5SeJgCbuK9zWAjwSXw14ovayYw5XJ/fjSS', 'customer', 'Active', '2026-03-27 01:50:15.816107'),
(1786230298, 'Sadia Hasan', 'sadia.hasan3@example.com', '01722633920', '$2b$12$cv.Opofs6Rg9FS.iT3swfu1mT.rqSWD3SHCd.rVmx6lXtRZIVFdk2', 'customer', 'Active', '2026-07-28 01:50:15.816107'),
(1786230425, 'Farhana Rahman', 'farhana.rahman4@example.com', '01778106871', '$2b$12$8GomJW1iobcrvavfkPObMOM4KzML4/gM5ol1FWxTLPDSb5QTY1TjW', 'customer', 'Active', '2026-07-20 01:50:15.816107'),
(1786230575, 'Tanvir Chowdhury', 'tanvir.chowdhury5@example.com', '01768202938', '$2b$12$gHsgGzu9.N4Hjlrch/Tapu6BuvWt6NyZLIuMnOaxUmJj8JoH0DK2G', 'customer', 'Active', '2026-06-11 01:50:15.816107'),
(1786230721, 'Nusrat Khan', 'nusrat.khan6@example.com', '01722175294', '$2b$12$obpJu1lJUeYetadtpeZ7Fera.XhDKTACnGrNMBi2i3HfI1Qy0Rsc6', 'customer', 'Active', '2026-07-27 01:50:15.816107'),
(1786230830, 'Imran Uddin', 'imran.uddin7@example.com', '01785893910', '$2b$12$vh4U7Oc1xly/.Jc7yhiXg.07AFxsjz2aVPhQ4NNWL0P/MPhOJlWGO', 'customer', 'Active', '2026-03-03 01:50:15.816107'),
(1786230997, 'Mahmud Akter', 'mahmud.akter8@example.com', '01794212661', '$2b$12$cCLDfH.2cw9QupvQahjp6.KaTxxMe7ZzmsQC4WoS37WoSaJ681.06', 'customer', 'Active', '2026-03-17 01:50:15.816107'),
(1786231122, 'Sumaiya Hossain', 'sumaiya.hossain9@example.com', '01788590039', '$2b$12$SoY2oiLVU7ChlkWI2YTpi.iXC58crRlRu6xlO7bD4Jq8eSx1DGW4K', 'customer', 'Active', '2026-06-16 01:50:15.816107'),
(1786231269, 'Arif Alam', 'arif.alam10@example.com', '01716252221', '$2b$12$xqFlxeH9fYJlpaiEYblcv.g2T90cPiPE76puRZuqO5RVxZzFVatvW', 'customer', 'Active', '2026-05-29 01:50:15.816107'),
(1786231380, 'Jannat Ahmed', 'jannat.ahmed11@example.com', '01766255890', '$2b$12$LsLjR6Bc36l0pQqCtgKdUObDRUBSmhFl.IBD33crmHzXRhBTA0XMu', 'customer', 'Active', '2026-07-12 01:50:15.816107'),
(1786231527, 'Rakib Islam', 'rakib.islam12@example.com', '01786626738', '$2b$12$4gclZlLXaDX7Fv3zGejq/OZ1HrYywwUCAm05.zlh6c7n3IeUFJmbm', 'customer', 'Active', '2026-02-18 01:50:15.816107'),
(1786231651, 'Nadia Hasan', 'nadia.hasan13@example.com', '01734256684', '$2b$12$wwgplks.S4IQb4uyJtGynOxp/3DKLhAHP1wBgqxVzzB.LZkK6Fw1u', 'customer', 'Active', '2026-03-18 01:50:15.816107'),
(1786231794, 'Shakil Rahman', 'shakil.rahman14@example.com', '01795753514', '$2b$12$rbVxIvpKpiZFVlqMr8hgDeaywZVPwNtQocpjeMMGgLQVTWuPpkhRa', 'customer', 'Active', '2026-07-18 01:50:15.816107'),
(1786231964, 'Tania Chowdhury', 'tania.chowdhury15@example.com', '01783517017', '$2b$12$X4YdIz328OTEGHPtANr8uepzHkY.SgTLTGohyu8jO6bPFsUpZ3Cju', 'customer', 'Active', '2026-03-20 01:50:15.816107'),
(1786232095, 'Rasel Khan', 'rasel.khan16@example.com', '01717999533', '$2b$12$sP3bLUSgqbOSdeytHqbu/uTFBa9QJaseF9rkK7HRgtsju2J30OEB6', 'customer', 'Active', '2026-04-06 01:50:15.816107'),
(1786232220, 'Mim Uddin', 'mim.uddin17@example.com', '01781366283', '$2b$12$9P8L7ZpASEt0EGIGAe9hHuIizx1M02FTB7SvVe6bmXQmh/PBzPdwC', 'customer', 'Active', '2026-05-23 01:50:15.816107'),
(1786232367, 'Fahim Akter', 'fahim.akter18@example.com', '01772492024', '$2b$12$OfewuSfHYRbrxFlb.dnzY.pg0gOVl5Mu7eQsnIYLUCega81NfL0qS', 'customer', 'Active', '2026-05-11 01:50:15.816107'),
(1786232482, 'Ruma Hossain', 'ruma.hossain19@example.com', '01750234045', '$2b$12$CmUZu0lNFrnbSDBnDCRTvuLKyHhAK91ljyMWFzc7nda9uxPSbuO5G', 'customer', 'Active', '2026-06-26 01:50:15.816107'),
(1786232609, 'Habib Alam', 'habib.alam20@example.com', '01742762079', '$2b$12$4SIieIkd5PiBiPQ.BHizSuvXpTly0yKTr7XCxqvQqvXjY2sKHYOrW', 'customer', 'Active', '2026-05-27 01:50:15.816107'),
(1786232772, 'Shanta Ahmed', 'shanta.ahmed21@example.com', '01780490681', '$2b$12$N3NvuyX4CIRp0QKOSKZqGeYBGWgHRBdAm7nHVRHyUs0y0Yiq3yp6m', 'customer', 'Active', '2026-02-06 01:50:15.816107'),
(1786232896, 'Zubayer Islam', 'zubayer.islam22@example.com', '01770241505', '$2b$12$WCsDqExNh6NwLAWSnLhA8./APcdEskYZYLd9evz2p2gREkEbT6nVW', 'customer', 'Active', '2026-07-24 01:50:15.816107'),
(1786233047, 'Lamia Hasan', 'lamia.hasan23@example.com', '01725846520', '$2b$12$6DrVx.4HkO7FofuGJh2eh.wNrhVY.cPXAePUoxTs.PvNnlyf9taKm', 'customer', 'Active', '2026-06-30 01:50:15.816107'),
(1786233161, 'Anik Rahman', 'anik.rahman24@example.com', '01755909953', '$2b$12$3qnq8sIx9LkRl6nPZ8loT.Zb4Vadi8mKj5/nZ7r2pBWyclsZ2PU6i', 'customer', 'Active', '2026-04-26 01:50:15.816107'),
(1786233331, 'Sharmin Chowdhury', 'sharmin.chowdhury25@example.com', '01715262308', '$2b$12$r49yehO1FDMbmW.c/wuOiO7toz/Jya3iEOw5r2dS8FH3JShPCuHpq', 'customer', 'Active', '2026-01-28 01:50:15.816107'),
(1786233462, 'Rafiq Khan', 'rafiq.khan26@example.com', '01784903659', '$2b$12$z1SLWLYxsUiNVHORYvMqz..FQynD.6YqXesNx9lSqKmuMSsadPn7.', 'customer', 'Active', '2026-05-23 01:50:15.816107'),
(1786233607, 'Popy Uddin', 'popy.uddin27@example.com', '01755650450', '$2b$12$bXuOm0fC9/F4a3tDOKtNgu/wbemxZWxxqUSGAiMUHoSMqd3w6XtFm', 'customer', 'Active', '2026-03-12 01:50:15.816107'),
(1786233737, 'Sajid Akter', 'sajid.akter28@example.com', '01776662562', '$2b$12$ihr5XbU6CNFqzLWUeKvvYewb5PMAfNoyhUsIMBa5rmQtr58n2Ma6C', 'customer', 'Active', '2026-04-17 01:50:15.816107'),
(1786233842, 'Meherun Hossain', 'meherun.hossain29@example.com', '01719229206', '$2b$12$N.nNYhbHSkO93eJFdxRoPujtamkhTuCfci7FRLV0WOtuX5NoWPA4m', 'customer', 'Active', '2026-04-12 01:50:15.816107'),
(1786233978, 'Tariq Alam', 'tariq.alam30@example.com', '01799141000', '$2b$12$JFS9YlxwN4zA.pGuFnpR1OKEGwclLdsy05er9ehowgIcI/x67HHsC', 'customer', 'Active', '2026-02-05 01:50:15.816107'),
(1786484073, 'Turjo Sarker', 'sarkerturjo2022@gmail.com', NULL, '$2b$12$XFEGuaoM.zLVk2tZTbYaieos9mCf5dEMPekrFba0HmlEu3lC/3FCa', 'admin', 'Active', '2026-08-25 11:41:04.920086');

drop table returns

INSERT INTO customer (user_id, newsletter_opt_in) VALUES
(1786230010, FALSE),
(1786230142, FALSE),
(1786230298, FALSE),
(1786230425, FALSE),
(1786230575, FALSE),
(1786230721, FALSE),
(1786230830, FALSE),
(1786230997, FALSE),
(1786231122, FALSE),
(1786231269, FALSE),
(1786231380, FALSE),
(1786231527, FALSE),
(1786231651, FALSE),
(1786231794, FALSE),
(1786231964, FALSE),
(1786232095, FALSE),
(1786232220, FALSE),
(1786232367, FALSE),
(1786232482, FALSE),
(1786232609, FALSE),
(1786232772, FALSE),
(1786232896, FALSE),
(1786233047, FALSE),
(1786233161, FALSE),
(1786233331, FALSE),
(1786233462, FALSE),
(1786233607, FALSE),
(1786233737, FALSE),
(1786233842, FALSE),
(1786233978, FALSE);

INSERT INTO admin (user_id, admin_level, department) VALUES
(1786484073, NULL, NULL);

-- Example insert format once you have address data:

SELECT * FROM users;
SELECT * FROM customer;
SELECT * FROM admin;

-- DROP TABLE IF EXISTS admin CASCADE;
-- DROP TABLE IF EXISTS customer CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;