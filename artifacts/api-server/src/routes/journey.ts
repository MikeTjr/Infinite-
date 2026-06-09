import { Router } from "express";
import { z } from "zod/v4";

const router = Router();

interface JourneyRecord {
  coupleId: string;
  currentSeason: string;
  startedAt: string;
  completedDays: number;
  lastCheckinAt?: string;
  checkinDates: string[];
}

const journeys = new Map<string, JourneyRecord>();

const StartJourneyBody = z.object({
  coupleId: z.string().min(1),
  seasonId: z.string().min(1),
});

const CheckinBody = z.object({
  coupleId: z.string().min(1),
});

router.post("/journey/start", (req, res) => {
  const parsed = StartJourneyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const journey: JourneyRecord = {
    coupleId: parsed.data.coupleId,
    currentSeason: parsed.data.seasonId,
    startedAt: new Date().toISOString(),
    completedDays: 0,
    checkinDates: [],
  };

  journeys.set(parsed.data.coupleId, journey);
  res.status(201).json(journey);
});

router.get("/journey/:coupleId", (req, res) => {
  const journey = journeys.get(req.params.coupleId);
  if (!journey) {
    res.status(404).json({ error: "No active journey found" });
    return;
  }
  res.json(journey);
});

router.post("/journey/checkin", (req, res) => {
  const parsed = CheckinBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const journey = journeys.get(parsed.data.coupleId);
  if (!journey) {
    res.status(404).json({ error: "No active journey found — start one first" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const alreadyCheckedIn = journey.checkinDates.includes(today);

  if (alreadyCheckedIn) {
    res.json({ journey, alreadyCheckedIn: true, message: "Already checked in today" });
    return;
  }

  journey.lastCheckinAt = new Date().toISOString();
  journey.completedDays += 1;
  journey.checkinDates.push(today);

  res.json({ journey, alreadyCheckedIn: false, message: "Check-in recorded" });
});

export default router;
