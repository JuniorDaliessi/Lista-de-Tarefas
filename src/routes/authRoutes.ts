import { Router } from 'express';
import { asyncHandler } from '../utils/apiHandlers';
import userService from '../services/userService';

const router = Router();

// Registro de usuário
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      status: 'error',
      message: 'Todos os campos são obrigatórios'
    });
  }
  
  const user = await userService.register({ email, password, name });
  
  return res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name
      }
    }
  });
}));

// Login de usuário
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email e senha são obrigatórios'
    });
  }
  
  const { token, user } = await userService.login({ email, password });
  
  return res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name
      }
    }
  });
}));

export default router; 