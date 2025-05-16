import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = Math.random().toString(36).substring(2, 10);
  
  req.headers['x-request-id'] = requestId;
  
  logger.info(`Request received: ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  
  const start = Date.now();
  
  const logResponse = () => {
    const duration = Date.now() - start;
    
    logger.info(`Request completed: ${req.method} ${req.path}`, {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  };
  
  res.on('finish', logResponse);
  
  next();
};