import { Request, Response } from 'express';

export default {
  index(req: Request, res: Response) {
    return res.json({ message: 'Lista de usuários' });
  },

  create(req: Request, res: Response) {
    const { name } = req.body;
    return res.status(201).json({ message: `Usuário ${name} criado!` });
  },
};
