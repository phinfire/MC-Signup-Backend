import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT, allowedOrigins, ADMIN_DISCORD_ID, MODERATOR_IDS } from './config';
import authRoutes from './routes/auth';
import signupRoutes from './routes/signup';
import healthRoutes from './routes/health';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin/signups';
import moderatorRoutes from './routes/moderator';

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin && origin.startsWith(o))) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    }
}));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin/signups', adminRoutes);
app.use('/api/moderator', moderatorRoutes);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

