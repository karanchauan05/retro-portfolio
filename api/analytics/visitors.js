// Vercel Serverless Function for Visitor Analytics
// File: api/analytics/visitors.js

let visitorCount = 0;
const visitors = new Set();

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return current visitor count
    res.status(200).json({
      visitors: visitorCount,
      unique_visitors: visitors.size,
      timestamp: new Date().toISOString()
    });
  } else if (req.method === 'POST') {
    // Track a new visitor
    const { visitor_id, ip } = req.body;
    const clientIP = ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Use visitor_id or IP as unique identifier
    const uniqueId = visitor_id || clientIP;
    
    if (uniqueId && !visitors.has(uniqueId)) {
      visitors.add(uniqueId);
      visitorCount++;
    }
    
    res.status(200).json({
      visitors: visitorCount,
      unique_visitors: visitors.size,
      visitor_added: !visitors.has(uniqueId)
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}