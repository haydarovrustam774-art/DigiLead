export const PRISMA_SCHEMA = `// ========================================================================
// DigiLead: Smart EdTech Hub - Database Architecture (Prisma ORM Schema)
// PostgreSQL Relational Schema for MTT Directors Digital Competency Hub
// ========================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ------------------------------------------------------------------------
// ENUMS
// ------------------------------------------------------------------------
enum UserRole {
  superadmin     // Tizim administratori va umumiy vazirlik nazorati
  director       // MTT direktori (boshqaruvchi)
  it_methodist   // IT-metodist (raqamli ustoz va murabbiy)
  auditor        // Ta'lim sifati inspektori / auditor
}

enum DigitalReadinessLevel {
  beginner       // Boshlang'ich (0-49 ball) - ko'makka muhtoj
  intermediate   // O'rta (50-74 ball) - mustaqil foydalanuvchi
  advanced       // Ilg'or (75-100 ball) - mentorlik qila oladigan lider
}

enum PlanProgressStatus {
  not_started    // Boshlanmagan
  in_progress    // O'rganilmoqda
  completed      // Muvaffaqiyatli yakunlangan
}

enum ToolName {
  GOOGLE_DRIVE   // Bulutli xotira va hujjatlar
  ZOOM           // Onlayn uchrashuv va ota-onalar majlisi
  ERP_SYSTEM     // MTT moddiy-moliyaviy boshqaruv tizimi
  CHATGPT_AI     // Sun'iy intellekt yordamchisi
  TELEGRAM_BOT   // Tezkor xabardorlik va rasmiy kanal
  LMS_PLATFORM   // Ta'lim sifatini monitoring qilish tizimi
}

// ------------------------------------------------------------------------
// 1. USERS (Foydalanuvchilar jadvali)
// ------------------------------------------------------------------------
model User {
  id                    String                @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  fullName              String                @map("full_name") @db.VarChar(255)
  email                 String                @unique @db.VarChar(255)
  passwordHash          String                @map("password_hash") @db.VarChar(255)
  role                  UserRole              @default(director)
  organizationId        String                @map("organization_id") @db.VarChar(100)
  organizationName      String                @map("organization_name") @db.VarChar(255)
  digitalReadinessLevel DigitalReadinessLevel @default(beginner) @map("digital_readiness_level")
  phoneNumber           String?               @map("phone_number") @db.VarChar(50)
  createdAt             DateTime              @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt             DateTime              @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Munosabatlar (Relations)
  indicators            DigitalIndicators12[]
  toolLogs              ToolUsageLog[]
  actionPlans           DigitalActionPlan[]
  auditResponses        AuditResponse[]

  @@index([role])
  @@index([organizationId])
  @@map("users")
}

// ------------------------------------------------------------------------
// 2. DIGITAL_INDICATORS_12 (12 ta asosiy axborot indikatorlari jadvali)
// ------------------------------------------------------------------------
model DigitalIndicators12 {
  id                        String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId                    String              @map("user_id") @db.Uuid
  evaluationPeriod          String              @map("evaluation_period") @db.VarChar(20) // Masalan: "2026-Q1"

  // 12 ta Ko'rsatkich (0 dan 100 gacha shkala)
  cloudComputingUsage       Int                 @default(0) @map("cloud_computing_usage")
  dataDrivenDecisions       Int                 @default(0) @map("data_driven_decisions")
  edtechIntegration         Int                 @default(0) @map("edtech_integration")
  cybersecurityAwareness    Int                 @default(0) @map("cybersecurity_awareness")
  digitalCommunication      Int                 @default(0) @map("digital_communication")
  digitalMonitoring         Int                 @default(0) @map("digital_monitoring")
  resourceDigitization      Int                 @default(0) @map("resource_digitization")
  aiAutomationAdoption      Int                 @default(0) @map("ai_automation_adoption")
  digitalEthics             Int                 @default(0) @map("digital_ethics")
  lmsNavigation             Int                 @default(0) @map("lms_navigation")
  digitalTroubleshooting    Int                 @default(0) @map("digital_troubleshooting")
  continuousDigitalLearning Int                 @default(0) @map("continuous_digital_learning")

  totalDigitalScore         Int                 @default(0) @map("total_digital_score")
  createdAt                 DateTime            @default(now()) @map("created_at") @db.Timestamptz(6)

  // Foreign keys
  user                      User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  actionPlans               DigitalActionPlan[]

  @@unique([userId, evaluationPeriod])
  @@index([userId])
  @@map("digital_indicators_12")
}

// ------------------------------------------------------------------------
// 3. TOOL_USAGE_LOGS (Raqamli vositalardan foydalanish statistikasi)
// ------------------------------------------------------------------------
model ToolUsageLog {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId         String    @map("user_id") @db.Uuid
  toolName       ToolName  @map("tool_name")
  usageFrequency Int       @default(1) @map("usage_frequency") // Haftalik faollik soni
  actionType     Json      @map("action_type") // { action: "create_doc", details: "Buyruq yaratildi", count: 3 }
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, toolName])
  @@map("tool_usage_logs")
}

// ------------------------------------------------------------------------
// 4. DIGITAL_ACTION_PLANS (Shaxsiy Raqamli Rivojlanish Dasturi)
// ------------------------------------------------------------------------
model DigitalActionPlan {
  id                   String               @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId               String               @map("user_id") @db.Uuid
  generatedBasedOnKpiId String              @map("generated_based_on_kpi_id") @db.Uuid

  week1Tasks           Json                 @map("week_1_tasks") // [{ id, title, duration, completed, ... }]
  week2Tasks           Json                 @map("week_2_tasks")
  week3Tasks           Json                 @map("week_3_tasks")
  week4Tasks           Json                 @map("week_4_tasks")

  progressStatus       PlanProgressStatus   @default(not_started) @map("progress_status")
  targetWeakIndicators Json                 @map("target_weak_indicators") // ["cybersecurity_awareness", "cloud_computing_usage"]
  aiReasoning          String?              @map("ai_reasoning") @db.Text
  createdAt            DateTime             @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt            DateTime             @updatedAt @map("updated_at") @db.Timestamptz(6)

  user                 User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  kpiSnapshot          DigitalIndicators12  @relation(fields: [generatedBasedOnKpiId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("digital_action_plans")
}

// ------------------------------------------------------------------------
// 5. AUDIT_RESPONSES (O'z-o'zini baholash va Case-study javoblari)
// ------------------------------------------------------------------------
model AuditResponse {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  caseId       String   @map("case_id") @db.VarChar(100)
  selectedOptionId String @map("selected_option_id") @db.VarChar(100)
  awardedScore Int      @map("awarded_score")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("audit_responses")
}
`;

export const SQL_DDL_SCHEMA = `-- ========================================================================
-- PostgreSQL DDL Script: DigiLead Smart EdTech Hub
-- Database Schema with Constraints, Foreign Keys and Indices
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role_enum AS ENUM ('superadmin', 'director', 'it_methodist', 'auditor');
CREATE TYPE digital_readiness_enum AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE action_plan_status_enum AS ENUM ('not_started', 'in_progress', 'completed');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'director',
    organization_id VARCHAR(100) NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    digital_readiness_level digital_readiness_enum NOT NULL DEFAULT 'beginner',
    phone_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 12 Digital Indicators Table
CREATE TABLE digital_indicators_12 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    evaluation_period VARCHAR(20) NOT NULL, -- e.g. '2026-Q1'
    
    -- 12 Digital Competency Indicators (0 to 100 range)
    cloud_computing_usage INT NOT NULL DEFAULT 0 CHECK (cloud_computing_usage BETWEEN 0 AND 100),
    data_driven_decisions INT NOT NULL DEFAULT 0 CHECK (data_driven_decisions BETWEEN 0 AND 100),
    edtech_integration INT NOT NULL DEFAULT 0 CHECK (edtech_integration BETWEEN 0 AND 100),
    cybersecurity_awareness INT NOT NULL DEFAULT 0 CHECK (cybersecurity_awareness BETWEEN 0 AND 100),
    digital_communication INT NOT NULL DEFAULT 0 CHECK (digital_communication BETWEEN 0 AND 100),
    digital_monitoring INT NOT NULL DEFAULT 0 CHECK (digital_monitoring BETWEEN 0 AND 100),
    resource_digitization INT NOT NULL DEFAULT 0 CHECK (resource_digitization BETWEEN 0 AND 100),
    ai_automation_adoption INT NOT NULL DEFAULT 0 CHECK (ai_automation_adoption BETWEEN 0 AND 100),
    digital_ethics INT NOT NULL DEFAULT 0 CHECK (digital_ethics BETWEEN 0 AND 100),
    lms_navigation INT NOT NULL DEFAULT 0 CHECK (lms_navigation BETWEEN 0 AND 100),
    digital_troubleshooting INT NOT NULL DEFAULT 0 CHECK (digital_troubleshooting BETWEEN 0 AND 100),
    continuous_digital_learning INT NOT NULL DEFAULT 0 CHECK (continuous_digital_learning BETWEEN 0 AND 100),

    total_digital_score INT NOT NULL DEFAULT 0 CHECK (total_digital_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_period UNIQUE (user_id, evaluation_period)
);

-- 3. Tool Usage Logs Table
CREATE TABLE tool_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    usage_frequency INT NOT NULL DEFAULT 1,
    action_type JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Digital Action Plans Table
CREATE TABLE digital_action_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    generated_based_on_kpi_id UUID NOT NULL REFERENCES digital_indicators_12(id) ON DELETE CASCADE,
    week_1_tasks JSONB NOT NULL,
    week_2_tasks JSONB NOT NULL,
    week_3_tasks JSONB NOT NULL,
    week_4_tasks JSONB NOT NULL,
    progress_status action_plan_status_enum NOT NULL DEFAULT 'not_started',
    target_weak_indicators JSONB NOT NULL,
    ai_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid queries and high-traffic analytics
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_kpi_user ON digital_indicators_12(user_id);
CREATE INDEX idx_logs_user_tool ON tool_usage_logs(user_id, tool_name);
CREATE INDEX idx_plans_user ON digital_action_plans(user_id);
`;
