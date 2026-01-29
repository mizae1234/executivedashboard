-- Example Table Structure for GI Income Report
-- This is what the application expects the data to look like.

CREATE TABLE IF NOT EXISTS gi_income_data (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    channel VARCHAR(50) NOT NULL, -- e.g., 'Agency', 'Direct', 'Broker'
    amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for date range querying
CREATE INDEX idx_gi_income_date ON gi_income_data(date);

-- Sample Data Seeding
INSERT INTO gi_income_data (date, channel, amount) VALUES
('2024-01-05', 'Agency', 50000.00),
('2024-01-12', 'Direct', 25000.00),
('2024-02-22', 'Broker', 80000.00);

-- ==========================================
-- Master Map Tables (Language Mapping)
-- ==========================================

-- 1. Master Order Types
CREATE TABLE IF NOT EXISTS master_order_types (
    id SERIAL PRIMARY KEY,
    name_cn VARCHAR(100) NOT NULL, -- Chinese Name
    name_en VARCHAR(100) NOT NULL  -- English Name
);

INSERT INTO master_order_types (name_cn, name_en) VALUES
('维修', 'Repair'),
('索赔', 'Claims');

-- 2. Master Work Order Statuses
CREATE TABLE IF NOT EXISTS master_work_order_statuses (
    id SERIAL PRIMARY KEY,
    name_cn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

INSERT INTO master_work_order_statuses (name_cn, name_en) VALUES
('交车', 'Delivery'),
('新建', 'New'),
('已结算', 'Settled'),
('派工', 'Dispatch'),
('已提交结算', 'Settlement submitted');

-- 3. Master Repair Types
CREATE TABLE IF NOT EXISTS master_repair_types (
    id SERIAL PRIMARY KEY,
    name_cn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

INSERT INTO master_repair_types (name_cn, name_en) VALUES
('首次保养', 'First maintenance'),
('钣金喷漆', 'Sheet metal painting'),
('软件升级', 'Software upgrade'),
('服务活动', 'Service Activities'),
('服务月活动', 'Service Month Activities'),
('售前维修', 'Pre-sales repair'),
('内部维修', 'Internal repair'),
('一般维修', 'General maintenance'),
('PDI', 'PDI');

-- 4. Master Branches
CREATE TABLE IF NOT EXISTS master_branches (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL, -- Branch Code (lowercase)
    name VARCHAR(255) NOT NULL  -- Thai Name
);

INSERT INTO master_branches (code, name) VALUES
('gi', 'บริษัท โกลด์ อินทิเกรท จำกัด'),
('gi01', 'บริษัท โกลด์ อินทิเกรท กาญจนาภิเษก – บางแค จำกัด'),
('gi02', 'บริษัท โกลด์ อินทิเกรท มีนบุรี จำกัด'),
('gi03', 'บริษัท โกลด์ อินทิเกรท เลียบด่วนรามอินทรา จำกัด'),
('gi04', 'บริษัท โกลด์ อินทิเกรท สีลม ซอย 9 จำกัด'),
('gi05', 'บริษัท โกลด์ อินทิเกรท อุบลราชธานี จำกัด'),
('gi07', 'บริษัท โกลด์ อินทิเกรท มหาชัย จำกัด'),
('gi08', 'บริษัท โกลด์ อินทิเกรท ศาลายา จำกัด'),
('gi09', 'บริษัท โกลด์ อินทิเกรท วิภาวดี จำกัด'),
('gi10', 'บริษัท โกลด์ อินทิเกรท พิบูลสงคราม จำกัด'),
('gi11', 'บริษัท โกลด์ อินทิเกรท อยุธยา จำกัด');


