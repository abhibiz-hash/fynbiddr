import { Request, Response, NextFunction } from 'express';

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'SELLER') {
    // If req.user exists and the role is SELLER, proceed.
    return next();
  }

  // If we reach this point, the check failed. Send an error and stop.
  return res.status(403).json({ message: 'Forbidden: Access restricted to sellers.' });
};