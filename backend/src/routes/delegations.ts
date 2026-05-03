import { Router, Request, Response, NextFunction } from "express";
import { delegateVote } from "../services/delegationManager";
import { requireAuth } from "../middleware/auth";
import { badRequest } from "../utils/errors";

const router = Router();

// POST /api/delegations — Delegate vote to another token
router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ballotId, delegatorTokenHash, delegateTokenHash } = req.body;
      if (!ballotId || !delegatorTokenHash || !delegateTokenHash) {
        throw badRequest(
          "ballotId, delegatorTokenHash, and delegateTokenHash are required",
        );
      }
      await delegateVote(ballotId, delegatorTokenHash, delegateTokenHash);
      res
        .status(200)
        .json({ data: { message: "Vote delegated successfully" } });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
