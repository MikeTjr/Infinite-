import { Router } from "express";
import { z } from "zod/v4";

const router = Router();

interface BondEntry {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  members: Array<{ coupleId: string; coupleName: string; score: number; joinedAt: string }>;
}

const bonds = new Map<string, BondEntry>();

function generateBondCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const CreateBondBody = z.object({
  name: z.string().min(1).max(60),
  coupleId: z.string().min(1),
  coupleName: z.string().min(1),
  score: z.number().int().nonnegative().default(0),
});

const JoinBondBody = z.object({
  coupleId: z.string().min(1),
  coupleName: z.string().min(1),
  score: z.number().int().nonnegative().default(0),
});

function formatBond(bond: BondEntry) {
  return {
    id: bond.id,
    name: bond.name,
    code: bond.code,
    createdAt: bond.createdAt,
    memberCount: bond.members.length,
    memberNames: bond.members.map((m) => m.coupleName),
    collectiveScore: bond.members.reduce((sum, m) => sum + m.score, 0),
  };
}

router.post("/bonds", (req, res) => {
  const parsed = CreateBondBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  let code: string;
  let attempts = 0;
  do {
    code = generateBondCode();
    attempts++;
    if (attempts > 50) {
      res.status(500).json({ error: "Could not generate unique bond code" });
      return;
    }
  } while ([...bonds.values()].some((b) => b.code === code));

  const bond: BondEntry = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    code,
    createdAt: new Date().toISOString(),
    members: [{
      coupleId: parsed.data.coupleId,
      coupleName: parsed.data.coupleName,
      score: parsed.data.score,
      joinedAt: new Date().toISOString(),
    }],
  };

  bonds.set(bond.id, bond);
  res.status(201).json(formatBond(bond));
});

router.get("/bonds/:code", (req, res) => {
  const bond = [...bonds.values()].find((b) => b.code === req.params.code.toUpperCase());
  if (!bond) {
    res.status(404).json({ error: "Bond not found" });
    return;
  }
  res.json(formatBond(bond));
});

router.post("/bonds/:code/join", (req, res) => {
  const bond = [...bonds.values()].find((b) => b.code === req.params.code.toUpperCase());
  if (!bond) {
    res.status(404).json({ error: "Bond not found" });
    return;
  }

  const parsed = JoinBondBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const alreadyMember = bond.members.some((m) => m.coupleId === parsed.data.coupleId);
  if (!alreadyMember) {
    bond.members.push({
      coupleId: parsed.data.coupleId,
      coupleName: parsed.data.coupleName,
      score: parsed.data.score,
      joinedAt: new Date().toISOString(),
    });
  }

  res.json(formatBond(bond));
});

router.get("/bonds/:code/leaderboard", (req, res) => {
  const bond = [...bonds.values()].find((b) => b.code === req.params.code.toUpperCase());
  if (!bond) {
    res.status(404).json({ error: "Bond not found" });
    return;
  }

  const leaderboard = bond.members
    .map((m) => ({ name: m.coupleName, score: m.score, coupleId: m.coupleId }))
    .sort((a, b) => b.score - a.score)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  res.json({ leaderboard, bondName: bond.name, total: bond.members.length });
});

router.patch("/bonds/:code/score", (req, res) => {
  const bond = [...bonds.values()].find((b) => b.code === req.params.code.toUpperCase());
  if (!bond) {
    res.status(404).json({ error: "Bond not found" });
    return;
  }

  const { coupleId, score } = req.body as { coupleId: string; score: number };
  const member = bond.members.find((m) => m.coupleId === coupleId);
  if (member) member.score = score;

  res.json(formatBond(bond));
});

export default router;
