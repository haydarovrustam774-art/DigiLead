import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import prisma from './server/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PRISMA_SCHEMA, SQL_DDL_SCHEMA } from './src/data/schemas';
import { GoogleGenAI } from '@google/genai';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_digilead_2026';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

console.log('[AI] GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES ✓' : 'NO ✗');


// Middleware to protect routes
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());
  app.use(cors());

  // ------------------------------------------------------------------------
  // AUTHENTICATION API
  // ------------------------------------------------------------------------
  
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { fullName, email, password, organizationId, organizationName } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Bu email orqali allaqachon ro\'yxatdan o\'tilgan' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const totalUsers = await prisma.user.count();
      const assignedRole = totalUsers === 0 ? 'superadmin' : 'director';
      
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: hashedPassword,
          organizationId,
          organizationName,
          role: assignedRole
        }
      });
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server xatosi' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' });

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: 'Server xatosi' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.sendStatus(404);
      res.json({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, organizationName: user.organizationName, organizationId: user.organizationId });
    } catch (error) {
      res.status(500).json({ error: 'Server xatosi' });
    }
  });

  // Temporary endpoint to make someone a superadmin
  app.get('/api/make-admin', async (req: any, res: any) => {
    try {
      await prisma.user.updateMany({
        data: { role: 'superadmin' }
      });
      res.send("Barcha foydalanuvchilar superadmin qilindi! Endi tizimga qaytib 'Admin Panel'ni ko'rishingiz mumkin.");
    } catch (error) {
      res.send("Xatolik: " + String(error));
    }
  });

  // Admin Dashboard API - List Users
  app.get('/api/admin/users', authenticateToken, async (req: any, res: any) => {
    try {
      if (req.user.role !== 'superadmin') return res.sendStatus(403);
      
      const users = await prisma.user.findMany({
        include: {
          indicators: {
            where: { evaluationPeriod: '2026-Q1' }
          },
          actionPlans: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      const formattedUsers = users.map(u => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        organizationName: u.organizationName,
        digitalReadinessLevel: u.digitalReadinessLevel,
        createdAt: u.createdAt,
        latestIndicators: u.indicators[0] || null,
        actionPlans: u.actionPlans
      }));
      
      res.json(formattedUsers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ error: 'Server xatosi' });
    }
  });

  // Admin Dashboard API - Create User
  app.post('/api/admin/users', authenticateToken, async (req: any, res: any) => {
    try {
      if (req.user.role !== 'superadmin') return res.sendStatus(403);
      
      const { fullName, email, password, organizationId, organizationName, role } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Bu email band' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: hashedPassword,
          organizationId: organizationId || `org-${Date.now()}`,
          organizationName,
          role: role || 'director'
        }
      });
      res.json({ success: true, user });
    } catch (error) {
      console.error("Yangi foydalanuvchi qo'shishda xato:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Admin Dashboard API - Update User
  app.put('/api/admin/users/:id', authenticateToken, async (req: any, res: any) => {
    try {
      if (req.user.role !== 'superadmin') return res.sendStatus(403);
      const { id } = req.params;
      const { fullName, email, organizationId, organizationName, role, password } = req.body;
      
      const updateData: any = { fullName, email, organizationName, role };
      if (organizationId) updateData.organizationId = organizationId;
      if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
      });
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Foydalanuvchini tahrirlashda xato:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Admin Dashboard API - Delete User
  app.delete('/api/admin/users/:id', authenticateToken, async (req: any, res: any) => {
    try {
      if (req.user.role !== 'superadmin') return res.sendStatus(403);
      const { id } = req.params;
      
      // Also delete related indicators, plans, and logs
      await prisma.digitalIndicators12.deleteMany({ where: { userId: id } });
      await prisma.digitalActionPlan.deleteMany({ where: { userId: id } });
      await prisma.toolUsageLog.deleteMany({ where: { userId: id } });
      
      await prisma.user.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server xatosi' });
    }
  });

  // ------------------------------------------------------------------------
  // PROTECTED API ROUTES
  // ------------------------------------------------------------------------

  app.get('/api/indicators/:userId', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (req.user.id !== userId && req.user.role !== 'superadmin') return res.sendStatus(403);
      
      let indicators = await prisma.digitalIndicators12.findFirst({
        where: { userId: userId, evaluationPeriod: '2026-Q1' }
      });
      
      if (!indicators) {
        indicators = await prisma.digitalIndicators12.create({
          data: { userId, evaluationPeriod: '2026-Q1' }
        });
      }
      
      const formattedIndicators = {
        id: indicators.id,
        userId: indicators.userId,
        evaluationPeriod: indicators.evaluationPeriod,
        cloud_computing_usage: indicators.cloudComputingUsage,
        data_driven_decisions: indicators.dataDrivenDecisions,
        edtech_integration: indicators.edtechIntegration,
        cybersecurity_awareness: indicators.cybersecurityAwareness,
        digital_communication: indicators.digitalCommunication,
        digital_monitoring: indicators.digitalMonitoring,
        resource_digitization: indicators.resourceDigitization,
        ai_automation_adoption: indicators.aiAutomationAdoption,
        digital_ethics: indicators.digitalEthics,
        lms_navigation: indicators.lmsNavigation,
        digital_troubleshooting: indicators.digitalTroubleshooting,
        continuous_digital_learning: indicators.continuousDigitalLearning,
        total_digital_score: indicators.totalDigitalScore,
        initial_digital_score: indicators.initialDigitalScore,
        intellect_score: indicators.intellectScore,
        info_score: indicators.infoScore,
        creative_score: indicators.creativeScore,
        team_score: indicators.teamScore,
        updatedAt: (indicators as any).updatedAt || indicators.createdAt
      };
      
      res.json(formattedIndicators);
    } catch (error) {
      console.error("Error in /api/indicators/:userId:", error);
      res.status(500).json({ error: String(error) });
    }
  });
  app.get('/api/kpi/calculate-digital-score/:userId', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (req.user.id !== userId && req.user.role !== 'superadmin') return res.sendStatus(403);
      
      let indicators = await prisma.digitalIndicators12.findFirst({
        where: { userId: userId, evaluationPeriod: '2026-Q1' }
      });
      
      if (!indicators) {
        return res.status(404).json({ error: "Indikatorlar topilmadi" });
      }

      // 3 manbali hisoblash (bu yerda shunchaki bazadagi ma'lumotni qayta yuklaymiz yoki yangilaymiz)
      const mapping = [
        'cloudComputingUsage', 'dataDrivenDecisions', 'edtechIntegration', 'cybersecurityAwareness',
        'digitalCommunication', 'digitalMonitoring', 'resourceDigitization', 'aiAutomationAdoption',
        'digitalEthics', 'lmsNavigation', 'digitalTroubleshooting', 'continuousDigitalLearning'
      ];
      
      let total = 0;
      let count = 0;
      mapping.forEach(key => {
        const val = (indicators as any)[key] || 0;
        total += val;
        count++;
      });
      
      const totalDigitalScore = count > 0 ? Math.round(total / count) : 0;
      
      const updatedIndicators = await prisma.digitalIndicators12.update({
        where: { id: indicators.id },
        data: { totalDigitalScore }
      });
      
      let readinessLevel = 'beginner';
      if (totalDigitalScore >= 75) readinessLevel = 'advanced';
      else if (totalDigitalScore >= 50) readinessLevel = 'intermediate';
      
      await prisma.user.update({
        where: { id: userId },
        data: { digitalReadinessLevel: readinessLevel }
      });
      
      const formattedIndicators = {
        id: updatedIndicators.id,
        userId: updatedIndicators.userId,
        evaluationPeriod: updatedIndicators.evaluationPeriod,
        cloud_computing_usage: updatedIndicators.cloudComputingUsage,
        data_driven_decisions: updatedIndicators.dataDrivenDecisions,
        edtech_integration: updatedIndicators.edtechIntegration,
        cybersecurity_awareness: updatedIndicators.cybersecurityAwareness,
        digital_communication: updatedIndicators.digitalCommunication,
        digital_monitoring: updatedIndicators.digitalMonitoring,
        resource_digitization: updatedIndicators.resourceDigitization,
        ai_automation_adoption: updatedIndicators.aiAutomationAdoption,
        digital_ethics: updatedIndicators.digitalEthics,
        lms_navigation: updatedIndicators.lmsNavigation,
        digital_troubleshooting: updatedIndicators.digitalTroubleshooting,
        continuous_digital_learning: updatedIndicators.continuousDigitalLearning,
        total_digital_score: updatedIndicators.totalDigitalScore,
        updatedAt: (updatedIndicators as any).updatedAt || updatedIndicators.createdAt
      };
      
      res.json({ data: { indicators: formattedIndicators, readinessLevel } });
    } catch (error) {
      console.error("Error in calculate-digital-score:", error);
      res.status(500).json({ error: String(error) });
    }
  });


  // Submit Gamified Audit
  app.post('/api/digital-audit/submit', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId, answers } = req.body;
      if (req.user.id !== userId) return res.sendStatus(403);

      const mapping: any = {
        cloud_computing_usage: 'cloudComputingUsage',
        data_driven_decisions: 'dataDrivenDecisions',
        edtech_integration: 'edtechIntegration',
        cybersecurity_awareness: 'cybersecurityAwareness',
        digital_communication: 'digitalCommunication',
        digital_monitoring: 'digitalMonitoring',
        resource_digitization: 'resourceDigitization',
        ai_automation_adoption: 'aiAutomationAdoption',
        digital_ethics: 'digitalEthics',
        lms_navigation: 'lmsNavigation',
        digital_troubleshooting: 'digitalTroubleshooting',
        continuous_digital_learning: 'continuousDigitalLearning'
      };

      // Find or create indicators
      let indicators = await prisma.digitalIndicators12.findFirst({
        where: { userId, evaluationPeriod: '2026-Q1' }
      });
      
      if (!indicators) {
        indicators = await prisma.digitalIndicators12.create({
          data: { userId, evaluationPeriod: '2026-Q1' }
        });
      }

      // Update fields
      const updateData: any = {};
      let total = 0;
      let count = 0;
      
      for (const [snakeKey, camelKey] of Object.entries(mapping)) {
        // If answered in test, use it, otherwise keep existing
        const score = answers[snakeKey] !== undefined ? answers[snakeKey] : ((indicators as any)[camelKey as string] || 0);
        updateData[camelKey as string] = score;
        total += score;
        count++;
      }

      const totalDigitalScore = count > 0 ? Math.round(total / count) : 0;
      updateData.totalDigitalScore = totalDigitalScore;
      
      // Calculate the 4 main criteria based on the 12 indicators
      updateData.intellectScore = Math.round(((updateData.dataDrivenDecisions || 0) + (updateData.edtechIntegration || 0) + (updateData.continuousDigitalLearning || 0)) / 3);
      updateData.infoScore = Math.round(((updateData.cloudComputingUsage || 0) + (updateData.resourceDigitization || 0) + (updateData.lmsNavigation || 0)) / 3);
      updateData.creativeScore = Math.round(((updateData.aiAutomationAdoption || 0) + (updateData.digitalTroubleshooting || 0) + (updateData.cybersecurityAwareness || 0)) / 3);
      updateData.teamScore = Math.round(((updateData.digitalCommunication || 0) + (updateData.digitalMonitoring || 0) + (updateData.digitalEthics || 0)) / 3);

      if (!indicators.initialDigitalScore || indicators.initialDigitalScore === 0) {
        updateData.initialDigitalScore = totalDigitalScore;
        updateData.initialIndicatorsJson = JSON.stringify(updateData);
      }

      // Update Indicators
      const updatedIndicators = await prisma.digitalIndicators12.update({
        where: { id: indicators.id },
        data: updateData
      });

      // Update User Readiness Level
      let readinessLevel = 'beginner';
      if (totalDigitalScore >= 75) readinessLevel = 'advanced';
      else if (totalDigitalScore >= 50) readinessLevel = 'intermediate';

      await prisma.user.update({
        where: { id: userId },
        data: { digitalReadinessLevel: readinessLevel }
      });

      // Log the action
      await prisma.toolUsageLog.create({
        data: {
          userId,
          toolName: "Raqamli Kompetensiyani Baholash (Gamified Audit)",
          actionType: JSON.stringify({ type: "audit_submit", score: totalDigitalScore })
        }
      });

      // Format for frontend
      const formattedIndicators = {
        id: updatedIndicators.id,
        userId: updatedIndicators.userId,
        evaluationPeriod: updatedIndicators.evaluationPeriod,
        cloud_computing_usage: updatedIndicators.cloudComputingUsage,
        data_driven_decisions: updatedIndicators.dataDrivenDecisions,
        edtech_integration: updatedIndicators.edtechIntegration,
        cybersecurity_awareness: updatedIndicators.cybersecurityAwareness,
        digital_communication: updatedIndicators.digitalCommunication,
        digital_monitoring: updatedIndicators.digitalMonitoring,
        resource_digitization: updatedIndicators.resourceDigitization,
        ai_automation_adoption: updatedIndicators.aiAutomationAdoption,
        digital_ethics: updatedIndicators.digitalEthics,
        lms_navigation: updatedIndicators.lmsNavigation,
        digital_troubleshooting: updatedIndicators.digitalTroubleshooting,
        continuous_digital_learning: updatedIndicators.continuousDigitalLearning,
        total_digital_score: updatedIndicators.totalDigitalScore,
        initial_digital_score: updatedIndicators.initialDigitalScore,
        intellect_score: updatedIndicators.intellectScore,
        info_score: updatedIndicators.infoScore,
        creative_score: updatedIndicators.creativeScore,
        team_score: updatedIndicators.teamScore,
        updatedAt: (updatedIndicators as any).updatedAt || updatedIndicators.createdAt
      };

      res.json({
        success: true,
        result: {
          indicators: formattedIndicators,
          readinessLevel
        }
      });

    } catch (error) {
      console.error("Audit yuborishda xatolik:", error);
      res.status(500).json({ error: "Server xatosi" });
    }
  });

  app.post('/api/tool-usage/log', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId, toolName, actionType } = req.body;
      if (req.user.id !== userId) return res.sendStatus(403);

      const log = await prisma.toolUsageLog.create({
        data: {
          userId,
          toolName: toolName || "Tizim Simulyatori",
          actionType: actionType || "{}"
        }
      });

      const formattedLog = {
        ...log,
        actionType: log.actionType ? JSON.parse(log.actionType) : {}
      };

      res.json({ success: true, log: formattedLog });
    } catch (error) {
      console.error("Tool action log xatosi:", error);
      res.status(500).json({ error: "Server xatosi" });
    }
  });

  app.get('/api/tool-usage/:userId', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      const logs = await prisma.toolUsageLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      
      const formattedLogs = logs.map(log => ({
        ...log,
        actionType: log.actionType ? JSON.parse(log.actionType) : {}
      }));
      
      res.json(formattedLogs);
    } catch (error) {
      console.error("Error in /api/tool-usage/:userId:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.get('/api/action-plan/:userId', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      let plan = await prisma.digitalActionPlan.findFirst({
        where: { userId }
      });
      
      if (!plan) {
        let indicators;
        try {
          indicators = await prisma.digitalIndicators12.findFirst({ where: { userId } });
          if (!indicators) {
            indicators = await prisma.digitalIndicators12.create({ data: { userId, evaluationPeriod: '2026-Q1' } });
          }
        } catch (e) {
          indicators = await prisma.digitalIndicators12.findFirst({ where: { userId } });
        }
        
        plan = await prisma.digitalActionPlan.create({
          data: {
            userId,
            generatedBasedOnKpiId: indicators?.id || 'temp',
            week1Tasks: "[]",
            week2Tasks: "[]",
            week3Tasks: "[]",
            week4Tasks: "[]",
            targetWeakIndicators: "[]",
            progressStatus: "not_started"
          }
        });
      }
      // Transform JSON strings to actual arrays so frontend doesn't crash
      const formattedPlan = {
        ...plan,
        week_1_tasks: JSON.parse(plan.week1Tasks || "[]"),
        week_2_tasks: JSON.parse(plan.week2Tasks || "[]"),
        week_3_tasks: JSON.parse(plan.week3Tasks || "[]"),
        week_4_tasks: JSON.parse(plan.week4Tasks || "[]"),
        targetWeakIndicators: JSON.parse(plan.targetWeakIndicators || "[]"),
      };
      res.json(formattedPlan);
    } catch (error) {
      console.error("Error in /api/action-plan/:userId:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Toggle Action Plan Task
  app.post('/api/action-plan/toggle-task', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId, taskId } = req.body;
      if (req.user.id !== userId) return res.sendStatus(403);

      const plan = await prisma.digitalActionPlan.findFirst({ where: { userId } });
      if (!plan) return res.status(404).json({ error: "Reja topilmadi" });

      const toggleInArray = (jsonStr: string) => {
        let tasks = JSON.parse(jsonStr || "[]");
        let found = null;
        tasks = tasks.map((t: any) => {
          if (t.id === taskId) {
            t.completed = !t.completed;
            found = t;
          }
          return t;
        });
        return { str: JSON.stringify(tasks), found };
      };

      const w1 = toggleInArray(plan.week1Tasks);
      const w2 = toggleInArray(plan.week2Tasks);
      const w3 = toggleInArray(plan.week3Tasks);
      const w4 = toggleInArray(plan.week4Tasks);

      const foundTask = w1.found || w2.found || w3.found || w4.found;

      if (!foundTask) return res.status(404).json({ error: "Vazifa topilmadi" });

      await prisma.digitalActionPlan.update({
        where: { id: plan.id },
        data: {
          week1Tasks: w1.str,
          week2Tasks: w2.str,
          week3Tasks: w3.str,
          week4Tasks: w4.str,
        }
      });

      // Update indicators slightly as a reward if completed
      if (foundTask.completed) {
        await prisma.toolUsageLog.create({
          data: {
            userId,
            toolName: 'Raqamli Harakatlar Rejasi (Action Plan)' as any,
            actionType: JSON.stringify({ type: "task_completed", taskId, title: foundTask.title })
          }
        });
      }

      res.json({ success: true, task: foundTask });
    } catch (error) {
      console.error("Toggle task xatosi:", error);
      res.status(500).json({ error: "Server xatosi" });
    }
  });

  // Submit Weekly Test Score
  app.post('/api/action-plan/test-score/:userId', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      const { weekNum, score } = req.body;
      if (req.user.id !== userId) return res.sendStatus(403);

      const plan = await prisma.digitalActionPlan.findFirst({ where: { userId } });
      if (!plan) return res.status(404).json({ error: "Reja topilmadi" });

      const updateData: any = {};
      if (weekNum === 1) updateData.week1TestScore = score;
      if (weekNum === 2) updateData.week2TestScore = score;
      if (weekNum === 3) updateData.week3TestScore = score;
      if (weekNum === 4) updateData.week4TestScore = score;

      await prisma.digitalActionPlan.update({
        where: { id: plan.id },
        data: updateData
      });

      // Update the 4 criteria in indicators
      const indicators = await prisma.digitalIndicators12.findFirst({ where: { userId, evaluationPeriod: '2026-Q1' } });
      if (indicators) {
        let { intellectScore, infoScore, creativeScore, teamScore } = indicators;
        
        // Add up to 15% bonus based on the weekly test score (if score is out of 100, 100 * 0.15 = 15 points)
        if (weekNum === 1) intellectScore = Math.min(100, intellectScore + Math.round(score * 0.15));
        if (weekNum === 2) infoScore = Math.min(100, infoScore + Math.round(score * 0.15));
        if (weekNum === 3) creativeScore = Math.min(100, creativeScore + Math.round(score * 0.15));
        if (weekNum === 4) teamScore = Math.min(100, teamScore + Math.round(score * 0.15));

        await prisma.digitalIndicators12.update({
          where: { id: indicators.id },
          data: { intellectScore, infoScore, creativeScore, teamScore }
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Submit test score error:", error);
      res.status(500).json({ error: "Server xatosi" });
    }
  });

  // Generate AI Action Plan
  app.post('/api/action-plan/generate/:userId', authenticateToken, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (req.user.id !== userId) return res.sendStatus(403);

      let plan = await prisma.digitalActionPlan.findFirst({ where: { userId } });
      if (!plan) return res.status(404).json({ error: "Reja topilmadi" });

      // Get indicators to find weakest areas
      const indicators = await prisma.digitalIndicators12.findFirst({ where: { userId, evaluationPeriod: '2026-Q1' } });
      let targetWeakIndicators: string[] = [];
      
      if (indicators) {
        const mapping: any = {
          cloud_computing_usage: indicators.cloudComputingUsage || 0,
          data_driven_decisions: indicators.dataDrivenDecisions || 0,
          edtech_integration: indicators.edtechIntegration || 0,
          cybersecurity_awareness: indicators.cybersecurityAwareness || 0,
          digital_communication: indicators.digitalCommunication || 0,
          digital_monitoring: indicators.digitalMonitoring || 0,
          resource_digitization: indicators.resourceDigitization || 0,
          ai_automation_adoption: indicators.aiAutomationAdoption || 0,
          digital_ethics: indicators.digitalEthics || 0,
          lms_navigation: indicators.lmsNavigation || 0,
          digital_troubleshooting: indicators.digitalTroubleshooting || 0,
          continuous_digital_learning: indicators.continuousDigitalLearning || 0
        };
        const sorted = Object.entries(mapping).sort((a: any, b: any) => a[1] - b[1]);
        targetWeakIndicators = sorted.slice(0, 3).map(x => x[0]);
      } else {
        targetWeakIndicators = ["cybersecurity_awareness", "data_driven_decisions", "ai_automation_adoption"];
      }
      
      let week1Tasks, week2Tasks, week3Tasks, week4Tasks;
      let aiReasoning = `Tahlil natijalari: Sizning eng zaif 3 ta yo'nalishingiz (${targetWeakIndicators.join(', ')}). Har bir yo'nalish bo'yicha kuniga 1 tadan, jami kuniga 3 ta topshiriqdan iborat intensiv reja tuzildi.`;

      const indicatorNames: any = {
        cloud_computing_usage: "Bulutli xotira",
        data_driven_decisions: "Ma'lumotlar tahlili",
        edtech_integration: "EdTech vositalar",
        cybersecurity_awareness: "Kiberxavfsizlik",
        digital_communication: "Raqamli aloqa",
        digital_monitoring: "Raqamli monitoring",
        resource_digitization: "Resurslarni raqamlashtirish",
        ai_automation_adoption: "Sun'iy intellekt",
        digital_ethics: "Raqamli etika",
        lms_navigation: "LMS tizimlari",
        digital_troubleshooting: "Muammolarni hal etish",
        continuous_digital_learning: "Raqamli malaka oshirish"
      };

      const indicatorContexts: any = {
        cloud_computing_usage: { tool: "Google Drive, OneDrive yoki Dropbox", action: "bulutli papka yaratib hujjat yuklash", problem: "fleshka yo'qolishi va ma'lumot o'chib ketishi", metric: "bulutga yuklangan hujjatlar", partner: "tarbiyachilar", resource: "Bulutli texnologiyalar", result: "Fayllarga istalgan joydan kirish" },
        data_driven_decisions: { tool: "Excel, Google Sheets yoki ERP tizimi", action: "bolalar davomati va to'lovlar statistikasini filtrlash", problem: "qarorlarni taxminlarga asoslanib qabul qilish", metric: "tahlil qilingan hisobotlar", partner: "hisobchi va metodist", resource: "Ma'lumotlar tahlili", result: "Aniq raqamlarga asoslangan boshqaruv" },
        edtech_integration: { tool: "Wordwall, Kahoot yoki interaktiv doska", action: "mashg'ulot uchun bitta raqamli o'yin yaratish", problem: "bolalarning darsga qiziqishi pasayishi", metric: "raqamli vosita ishlatilgan darslar", partner: "tarbiyachi", resource: "EdTech vositalari", result: "Mashg'ulotlarga qiziqish ortishi" },
        cybersecurity_awareness: { tool: "Google Authenticator va kuchli parollar", action: "barcha ish akkauntlariga 2FA o'rnatish", problem: "akkauntlar buzilishi va o'g'irlanishi", metric: "himoyalangan akkauntlar", partner: "IT xodim", resource: "Kiberxavfsizlik qoidalari", result: "Ma'lumotlarning xavfsizligi" },
        digital_communication: { tool: "Telegram maxsus funksiyalari, Zoom", action: "ota-onalar uchun rasmiy raqamli so'rovnoma ochish", problem: "axborotning kechikishi va tushunmovchiliklar", metric: "raqamli muloqotlar", partner: "ota-onalar qo'mitasi", resource: "Raqamli muloqot", result: "Tezkor va shaffof axborot almashinuvi" },
        digital_monitoring: { tool: "Kuzatuv kameralari va raqamli jurnallar", action: "kunlik oziq-ovqat va davomatni tizim orqali nazorat qilish", problem: "nazoratning qog'ozda sekin olib borilishi", metric: "tasdiqlangan kunlik hisobotlar", partner: "hamshira va xo'jalik mudiri", resource: "Monitoring tizimlari", result: "Real vaqtdagi nazorat" },
        resource_digitization: { tool: "Mobil Skaner, Google Keep va PDF dasturlari", action: "eng muhim qog'oz hujjatlarni telefon orqali PDF formatga o'tkazish", problem: "qog'oz arxivning ko'payishi va hujjat izlashdagi qiyinchilik", metric: "raqamlashtirilgan hujjatlar", partner: "ish yurituvchi", resource: "Elektron arxiv yaratish", result: "Qog'ozsiz va tezkor ish yuritish" },
        ai_automation_adoption: { tool: "ChatGPT, Gemini yoki Claude", action: "majlis bayonnomasi matnini AI orqali yozdirish", problem: "matn tuzish va g'oya o'ylashga ko'p vaqt ketishi", metric: "AI yordamida qilingan ishlar", partner: "metodist", resource: "AI Promplar yozish", result: "Vaqtni kamida 2 barobar tejash" },
        digital_ethics: { tool: "Raqamli odob-axloq siyosati", action: "xodimlar bilan guruhlarda ma'lumot ulashish qoidalarini yozish", problem: "ish vaqtidan tashqari bezovta qilish", metric: "shikoyatlar", partner: "barcha xodimlar", resource: "Korporativ raqamli etika", result: "Sog'lom raqamli muhit" },
        lms_navigation: { tool: "MTT elektron tizimi (Nodavlat/Davlat LMS)", action: "tizimdagi shaxsiy kabinetga kirib profilni sozlash", problem: "tizim funksiyalaridan to'liq foydalanmaslik", metric: "LMS modullari", partner: "tizim administratori", resource: "LMS yo'riqnomasi", result: "Tizimdan 100% foydalanish" },
        digital_troubleshooting: { tool: "Helpdesk, Google Qidiruv va YouTube", action: "texnik muammo yechimini internetdan mustaqil izlash", problem: "kichik texnik nosozliklar uchun doim kimgadir qaram bo'lish", metric: "hal qilingan muammolar", partner: "texnik mutaxassis", resource: "Muammolarni izlash usullari", result: "Tezkor va mustaqil yechim" },
        continuous_digital_learning: { tool: "Coursera, YouTube Edu yoki maxsus platformalar", action: "Raqamli savodxonlik bo'yicha 15 daqiqalik video ko'rish", problem: "o'zgarib borayotgan texnologiyalardan orqada qolish", metric: "o'rganilgan yangi ko'nikmalar", partner: "boshqa direktorlar", resource: "Malaka oshirish portallari", result: "Doimiy yangilanib turadigan bilimlar" }
      };

      const generateTasksForWeek = (weekNum: number, weekLabel: string) => {
        const tasks: any[] = [];
        
        const build500WordDescription = (indName: string, ctx: any, variant: any, weekNum: number, day: number) => {
          return `Hurmatli rahbar, bugungi ${day}-kun topshirig'imiz to'g'ridan-to'g'ri "${indName}" yo'nalishini rivojlantirishga qaratilgan. Hozirgi kunda maktabgacha ta'lim muassasalarini (MTT) raqamli transformatsiya qilish va zamonaviy boshqaruv usullarini joriy etish nafaqat qulaylik, balki davr talabiga aylanib ulgurgan. Sizning rahbariy faoliyatingizda har kuni o'nlab, ba'zan yuzlab ma'lumotlar bilan ishlashga to'g'ri keladi. Afsuski, an'anaviy usullardan foydalanish ko'pincha ${ctx.problem} kabi noqulayliklarga va ortiqcha vaqt yo'qotishlarga olib keladi. Bu esa o'z navbatida ta'lim sifatiga va jamoa unumdorligiga salbiy ta'sir ko'rsatishi mumkin. Shuning uchun biz ushbu yo'l xaritasida sizni aynan shu muammolardan xalos etishni va faoliyatingizni raqamlashtirishni maqsad qilganmiz.

Bugungi asosiy mavzumiz: ${variant.title}. ${variant.desc} Biz aynan shu yo'nalishda chuqur bilim va ko'nikmalarni shakllantirishimiz kerak. Siz ${ctx.tool} kabi zamonaviy raqamli vositalardan foydalanishni o'rganish orqali boshqaruvda yangi bosqichga qadam qo'yasiz. Tasavvur qiling, bu ko'nikmani to'liq o'zlashtirganingizdan so'ng, siz qisqa vaqt ichida ${ctx.action} amaliyotini muvaffaqiyatli amalga oshira olasiz. Natijada ${ctx.result} ta'minlanadi, bu esa muassasangizning umumiy reytingi va ish samaradorligini keskin oshiradi.

Ushbu ${weekNum}-haftadagi maqsadimiz nafaqat nazariy bilimlarni olish, balki uni amaliyot bilan uzviy bog'lashdir. Rahbar sifatida sizning shaxsiy namunangiz butun jamoa uchun o'rnak bo'lishini unutmang. Qachonki siz yangi texnologiyalarni qo'rqmasdan ishlatishni boshlasangiz, jamoangiz ham sizga ergashadi. ${ctx.partner} bilan ishlash jarayonida bu raqamli vositalarning naqadar muhimligini ularga ham tushuntirishingiz kerak bo'ladi. Texnofobiyani yengish va raqamli muhitga moslashish qiyin tuyulishi mumkin, lekin siz ajratgan har bir 10 daqiqa kelajakda soatlab vaqtingizni tejab qoladi.

Bugungi topshiriqni muvaffaqiyatli yakunlash uchun quyidagi qoidalarga qat'iy amal qilishingizni so'raymiz: Birinchidan, e'tiboringizni to'liq bitta vazifaga qarating va chalg'imang. Ikkinchidan, agar biron narsa o'xshamasa, darhol tashlab ketmang - tizim bilan ishlashda xato qilish tabiiy holat, aynan xatolar orqali biz o'rganamiz. Uchinchidan, bugun qilingan ishni ertaga albatta takrorlang, chunki miya yangi ma'lumotni faqat amaliyot orqaligina qabul qiladi. Ish jarayonida ${ctx.metric} ko'rsatkichi aynan sizning harakatlaringiz tufayli ijobiy tomonga o'zgarishini yodda tuting. Sizning yutuqlaringiz nafaqat sizning, balki muassasadagi yuzlab tarbiyalanuvchilar va ularning ota-onalari uchun qulaylik yaratadi. Bugungi raqamli odatingiz - ertangi kuningizning muvaffaqiyat garovidir. 

Amaliy harakatlar ketma-ketligi (Buni qadam-baqadam bajaring):
1. Tayyorgarlik bosqichi: Ruhiy jihatdan tayyorlaning va kerakli ${ctx.resource} ma'lumotlarini yoki dastur interfeysini oching.
2. Dastlabki qadam: ${variant.guide[0]} amaliyotini diqqat bilan, shoshilmasdan amalga oshiring. Interfeys qanday tuzilganiga ahamiyat bering.
3. Asosiy jarayon: Tizim ichiga kirgach, navbatdagi qadam - ${variant.guide[1]} bo'ladi. Bu qadamni o'zlashtirish orqali siz asosiy funksiyani tushunib olasiz.
4. Natijani tahlil qilish: So'nggi bosqichda ${variant.guide[2]} jarayonini yakunlang. O'zgarishlarni va xatoliklarni kuzating, zarur bo'lsa qaytadan takrorlang.
5. Yakuniy xulosa: Bugungi mashg'ulotdan olgan eng muhim tajribangizni yon daftarchangizga yoki elektron eslatmalar ilovasiga qayd etib qo'ying.
Bu ketma-ketlikni to'g'ri bajarganingizdan so'ng, tizimda ushbu kun uchun berilgan topshiriqni "Bajarildi" deb belgilashingiz mumkin. Omad yor bo'lsin!`;
        };

        for (let day = 1; day <= 7; day++) {
          targetWeakIndicators.forEach((ind, i) => {
            const indName = indicatorNames[ind] || ind;
            const ctx = indicatorContexts[ind] || indicatorContexts['cloud_computing_usage'];
            let title = "";
            let desc = "";
            let guide: string[] = [];
            
            if (weekNum === 1) {
               const variations = [
                 { title: `Kirish: Nima uchun kerak?`, desc: `${ctx.problem} muammosini hal qilish uchun ${ctx.tool} ni o'rganishni boshlaymiz.`, guide: [`${ctx.resource} hujjatini topish`, "10 daqiqa o'qib chiqish", "Asosiy xulosani yozish"] },
                 { title: `Hozirgi holatni baholash`, desc: `Ishxonangizda ${ctx.metric} qanday ahvoldaligini tekshiring.`, guide: ["Joriy statistikani yozib olish", "Kamchiliklarni sanash", "O'zgarish zaruratini anglash"] },
                 { title: `Asbob-uskunalarni o'rganish`, desc: `Asosiy vosita bo'lgan ${ctx.tool} qanday ishlashini internetdan ko'rib chiqing.`, guide: ["YouTube'dan video topish", "Interfeysni ko'zdan kechirish", "Pullik/bepul ekanini tekshirish"] },
                 { title: `Tashqi tajriba`, desc: `Boshqa muassasalar ${ctx.tool} dan qanday foydalanishini tahlil qiling.`, guide: ["Tajribali direktor bilan gaplashish yoki maqola o'qish", "Yutuqlarini yozib olish", "Xavflarni so'rash"] },
                 { title: `To'siqlarni aniqlash`, desc: `Nimaga shu paytgacha bu ${indName} bo'yicha ishlar orqada qolganini aniqlang.`, guide: ["Xodimlarning bilimini baholash", "Texnik ta'minotni tekshirish", "O'z vaqtingizni tahlil qilish"] },
                 { title: `Raqamli xavfsizlik va etika`, desc: `${ctx.tool} ishlatganda qanday shaxsiy yoki texnik xavf borligini tushunib oling.`, guide: ["Xavfsizlik qoidalarini o'qish", "O'z parollarni tekshirish", "Nazariy tayyorgarlik ko'rish"] },
                 { title: `Nazariy marra`, desc: `Birinchi haftada o'rganilgan nazariy bilimlarni mustahkamlang. Natija: ${ctx.result}.`, guide: ["Daftarga asosiy qoidalarni yozish", "Kelasi hafta amaliyotga reja qilish", "Motivation videorolik ko'rish"] }
               ];
               const variant = variations[day - 1];
               title = `${indName}: ${variant.title}`;
               desc = build500WordDescription(indName, ctx, variant, weekNum, day);
               guide = variant.guide;
            } else if (weekNum === 2) {
               const variations = [
                 { title: `Dastlabki hisob (Akkaunt)`, desc: `${ctx.tool} da o'zingiz uchun profil oching yoki so'zlamalarni to'g'rilang.`, guide: ["Dasturni ochish", "Ro'yxatdan o'tish", "Profilni sozlash"] },
                 { title: `Asosiy funksiyani sinash`, desc: `Kichik bir ishni bajaring: ${ctx.action}.`, guide: ["Vosita interfeysiga kirish", "Kerakli tugmani topib bosish", "Jarayonni oxiriga yetkazish"] },
                 { title: `Xatolarni topish`, desc: `Jarayonda noto'g'ri narsa kiritib ko'ring va xato xabarini o'qib, orqaga qaytishni o'rganing.`, guide: ["Atayin xato ma'lumot berish", "Tizim reaksiyasini o'rganish", "Tuzatish (Undo) qilish"] },
                 { title: `Ma'lumotni tahrirlash`, desc: `Kecha bajargan ishingizni bugun qayta ochib, unga o'zgartirishlar kiriting.`, guide: ["Fayl/Jarayonni qayta ochish", "O'zgartirish kiritish", "Yangilanganini saqlash"] },
                 { title: `Qidiruv va saralash`, desc: `${ctx.tool} ichida oldingi ma'lumotlarni topish (qidiruv) amaliyotini qiling.`, guide: ["Qidiruv tugmasini topish", "Kalit so'z yozish", "Natijani tahlil qilish"] },
                 { title: `Shablon (Andoza) yaratish`, desc: `Doimiy qilinadigan ishlar uchun tayyor shablon tayyorlab qo'ying.`, guide: ["Yangi namuna yaratish", "Kerakli qismlarni to'ldirish", "'Andoza' deb saqlash"] },
                 { title: `Amaliyot sarhisobi`, desc: `Bu hafta qanchalik qiynaldingiz? Nimasi qulay ekanligini yozib boring.`, guide: ["Qiyinchiliklarni ro'yxatga olish", "Eng qulay xususiyatni topish", "O'z-o'ziga ishonch bildirish"] }
               ];
               const variant = variations[day - 1];
               title = `${indName}: ${variant.title}`;
               desc = build500WordDescription(indName, ctx, variant, weekNum, day);
               guide = variant.guide;
            } else if (weekNum === 3) {
               const variations = [
                 { title: `Hamkorga tushuntirish`, desc: `${ctx.partner}ni yoningizga chaqirib, ${ctx.tool}ning imkoniyatini 5 daqiqada ko'rsating.`, guide: ["Xodimni jalb qilish", "Asosiy afzalligini aytish", "1 ta amaliyotni ko'rsatish"] },
                 { title: `Birgalikda vazifa bajarish`, desc: `${ctx.action} amaliyotini hamkasbingiz bilan birga bajaring.`, guide: ["Rolni bo'lishish", "Jarayonni birga boshqarish", "Natijani yakunlash"] },
                 { title: `Fikr-mulohaza (Feedback)`, desc: `${ctx.partner}dan bu yangi raqamli vosita bo'yicha fikrlarini so'rang.`, guide: ["Ochiq savol berish", "Qiyinchiliklarni eshitish", "Fikrlarni yozib olish"] },
                 { title: `Raqamli qarshiliklarni yengish`, desc: `Jamoangiz orasida bu vositaga qarshi bo'lganlar bilan suhbat o'tkazing va foydasini tushuntiring.`, guide: ["E'tirozlarni sabr bilan eshitish", "Uning shaxsiy foydasini uqtirish", "Qo'llab-quvvatlashni va'da qilish"] },
                 { title: `Rolni almashtirish`, desc: `Endi ${ctx.partner} mustaqil ravishda ishni qilsin, siz esa kuzatib turing.`, guide: ["Jarayonni topshirish", "Xato qilsa sekin tushuntirish", "Mustaqilligini rag'batlantirish"] },
                 { title: `Umumiy qoidalar tasdiqlash`, desc: `Jamoaviy foydalanish uchun hamma amal qilishi kerak bo'lgan 3 ta oddiy qoida ishlab chiqing.`, guide: ["Qoidalarni yozish", "Guruhda e'lon qilish", "Rozilik olish"] },
                 { title: `Haftalik jamoaviy yutuq`, desc: `Birgalikda ishlash qanday natija berdi? Hamkasbingiz o'zini qanday his qilmoqda?`, guide: ["Kichik g'alabani nishonlash", "Maqtov so'zlarini aytish", "Keyingi oylarga reja qilish"] }
               ];
               const variant = variations[day - 1];
               title = `${indName}: ${variant.title}`;
               desc = build500WordDescription(indName, ctx, variant, weekNum, day);
               guide = variant.guide;
            } else {
               const variations = [
                 { title: `Vaqtni qat'iy belgilash`, desc: `Ish tartibingizga ushbu amaliyot uchun kunning aniq bitta qismini (masalan, 15:00) ajrating.`, guide: ["Kalendarga kiritish", "Eslatma qo'yish", "Rejaga qat'iy amal qilish"] },
                 { title: `Vaqt/Tejamkorlik auditi`, desc: `${ctx.problem} endi qanchalik kamaydi? Vaqtingiz qancha tejaldi? Hisoblang.`, guide: ["Oldingi vaqtni yozish", "Hozirgi vaqtni o'lchash", "Farqni (foydani) baholash"] },
                 { title: `Tizimli monitoring`, desc: `Boshqa xodimlar ${ctx.tool}dan to'g'ri va doimiy foydalanayotganini tekshiring.`, guide: ["Statistikani ochish", "Xatolar bormi ko'rish", "Maslahat berish"] },
                 { title: `Xatolarni minimallashtirish`, desc: `Ko'p uchrayotgan tushunmovchiliklarni yo'qotish uchun qisqa yo'riqnoma qog'ozi (Checklist) tayyorlang.`, guide: ["Eng ko'p xatolarni topish", "Qadamlarni qog'ozga yozish", "Ish stollariga yopishtirish"] },
                 { title: `Integratsiya: Kengaytirish`, desc: `Bu ko'nikmani muassasaning yana boshqa qaysi bo'limlariga (masalan: omborxona, oshxona) joriy qilsa bo'ladi?`, guide: ["Bo'limlarni tahlil qilish", "Mosligini tekshirish", "Vazifa belgilash"] },
                 { title: `Mustaqil tsikl`, desc: `Siz endi bu bo'yicha uztozsiz! Butun tsiklni bir o'zingiz eng qisqa vaqtda, xatosiz qilib chiqing.`, guide: ["Taymer qo'yish", "Tezlikni sinash", "100% natija"] },
                 { title: `Finish: Yangi daraja`, desc: `Tabriklaymiz, ${ctx.result} ga erishdingiz! Keyingi oy uchun rejalarni belgilang.`, guide: ["Natijalarni arxivlash", "O'zingizni rag'batlantirish", "Raqamli lider sifatini his qilish"] }
               ];
               const variant = variations[day - 1];
               title = `${indName}: ${variant.title}`;
               desc = build500WordDescription(indName, ctx, variant, weekNum, day);
               guide = variant.guide;
            }

            tasks.push({
              id: `t${weekNum}-d${day}-i${i}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              title: title,
              description: desc,
              durationMinutes: 10,
              weekNumber: weekNum,
              category: "practice",
              stageLabel: `Kun ${day}`,
              completed: false,
              badgeReward: { icon: "Sparkles", title: "Kundalik Odat" },
              stepGuide: guide
            });
          });
        }
        return tasks;
      };

      week1Tasks = generateTasksForWeek(1, "Nazariy anglash");
      week2Tasks = generateTasksForWeek(2, "Dastlabki qadamlar");
      week3Tasks = generateTasksForWeek(3, "Amaliy integratsiya");
      week4Tasks = generateTasksForWeek(4, "Ish jarayoniga joriy etish");

      const updatedPlan = await prisma.digitalActionPlan.update({
        where: { id: plan.id },
        data: {
          week1Tasks: JSON.stringify(week1Tasks),
          week2Tasks: JSON.stringify(week2Tasks),
          week3Tasks: JSON.stringify(week3Tasks),
          week4Tasks: JSON.stringify(week4Tasks),
          progressStatus: "in_progress",
          targetWeakIndicators: JSON.stringify(targetWeakIndicators),
          aiReasoning: aiReasoning
        }
      });

      const formattedPlan = {
        ...updatedPlan,
        week_1_tasks: JSON.parse(updatedPlan.week1Tasks),
        week_2_tasks: JSON.parse(updatedPlan.week2Tasks),
        week_3_tasks: JSON.parse(updatedPlan.week3Tasks),
        week_4_tasks: JSON.parse(updatedPlan.week4Tasks),
        targetWeakIndicators: JSON.parse(updatedPlan.targetWeakIndicators || "[]"),
      };

      res.json({ success: true, plan: formattedPlan });
    } catch (error) {
      console.error("Generate plan xatosi:", error);
      res.status(500).json({ error: "Server xatosi" });
    }
  });

  app.get('/api/architecture/schema', (req, res) => {
    res.json({
      prismaSchema: PRISMA_SCHEMA,
      sqlSchema: SQL_DDL_SCHEMA,
    });
  });

  // ------------------------------------------------------------------------
  // VITE MIDDLEWARE (Development vs Production)
  // ------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DigiLead Smart EdTech Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
