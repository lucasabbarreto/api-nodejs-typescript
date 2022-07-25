import { Router } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import knex from '../database/connection';
import authConfig from '../config/auth';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    const user = await knex('users').where('email', email).first();

    if (!user) {
        return res.status(400).json({ massage: 'Credentials not found.' });
    }

    const comparePassword = await compare(password, user.password);

    if (!comparePassword) {
        return res.status(400).json({ massage: 'Credentials not found.' });
    }

    const token = sign({}, authConfig.jwt.secret, {
        subject: String(user.id),
        expiresIn: authConfig.jwt.expiresIn
    });

    return res.json({ user, token });
});

export default sessionsRouter;