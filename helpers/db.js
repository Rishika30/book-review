import mongoose from 'mongoose';
import { config } from './env.js';

const databaseConnection = async () => {
    try {
        await mongoose.connect(config.DB_URL);
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
}

export default databaseConnection;