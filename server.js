import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import routes from './routes/gatewayRoute.js';

const PORT = process.env.PORT || 5000;

const app = express();

// Use Helmet to set secure HTTP headers and protect against common web vulnerabilities
app.use(helmet());


// // for authenticate request origin
// app.use(cors({ origin: true, credentials: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


// app.use(express.json());

//  for logging
app.use(morgan('dev'));

// rate limit for protect the ddos 
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

// for checking the health of api-gateway
app.get('/gatewayhealth', (_, res) =>
    res.json({
        ok: true, service: 'api-gateway'
    }));




for (const [base, cfg] of Object.entries(routes)) {
    // console.log("kjgrtt")
    app.use(base, createProxyMiddleware({
        target: cfg.target, changeOrigin: true,
        pathRewrite: (path) => path.replace(base, '/'),
        onProxyReq: (proxyReq, req) => {
            // propagate user id for tracing (optional)
            if (req.headers['x-request-id']) proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
        }
    }));
}


app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});