const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Configurar CORS para permitir el uso en emails
app.use(cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

// Configurar headers de cache para optimizar la carga
app.use((req, res, next) => {
    if (req.path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 año
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    }
    next();
});

// Servir archivos estáticos desde la carpeta public
app.use('/assets', express.static(path.join(__dirname, 'public'), {
    maxAge: '1y',
    etag: true,
    lastModified: true
}));

// Ruta de salud para Easypanel/Traefik
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'STM Assets Server',
        timestamp: new Date().toISOString()
    });
});

// Ruta principal con información del servicio
app.get('/', (req, res) => {
    res.json({
        service: 'STM Electromedd Assets Server',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            assets: '/assets/*'
        },
        example: {
            logo: `${req.protocol}://${req.get('host')}/assets/images/logo.png`
        }
    });
});

// Manejar errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Asset not found',
        path: req.path,
        available_endpoints: ['/health', '/assets/*']
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 STM Assets Server running on port ${PORT}`);
    console.log(`📁 Serving static files from /assets`);
    console.log(`🔗 Health check available at /health`);
});