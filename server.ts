import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT, allowedOrigins } from './config';
import authRoutes from './routes/auth';
import registerRoutes from './routes/signup';
import healthRoutes from './routes/health';
import signups from './routes/signups';
import userRoutes from './routes/getUser';
import getSignupRoutes from './routes/getSignup';
import adminSignupsRoutes from './routes/adminSignups';
import signedUpUsernamesRoutes from './routes/signedUpUsernames';
import moderatorGetAssignmentsRoutes from './routes/moderator/getAssignmentsForAllSignedUpUsers';
import moderatorUpdateAssignmentsRoutes from './routes/moderator/updateAssignments';

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
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/signup', registerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/signups', signups);
app.use('/api/getsignup', getSignupRoutes);
app.use('/api/admin/signups', adminSignupsRoutes);
app.use('/api/signedupusernames', signedUpUsernamesRoutes);

app.use('/api/moderator/getAssignmentsForAllSignedUpUsers', moderatorGetAssignmentsRoutes);
app.use('/api/moderator/updateAssignments', moderatorUpdateAssignmentsRoutes);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));

