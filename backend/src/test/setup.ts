/**
 * Explicit environment settings made here is strictly for the testing environment
 */
import {config} from 'dotenv';

config({path: '.env.development'});

// Ensure secrets are set for the test environment
process.env.ACCESS_TOKEN_SECRET = 'testAccessTokenSecret';
process.env.REFRESH_TOKEN_SECRET = 'testRefreshTokenSecret';