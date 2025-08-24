import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// This route is protected by the authenticateToken middleware
router.get('/', authenticateToken, (req, res) => {
  // If the request reaches this point, the middleware has already
  // verified the token and attached the user payload to req.user.

  // We can just send it back to the client.
  res.status(200).json(req.user);
});

export default router;