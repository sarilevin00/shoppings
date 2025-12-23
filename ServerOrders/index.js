/**
 * Orders API (Express) - stores orders in Elasticsearch
 *
 * env:
 *  - ELASTIC_URL (e.g. http://localhost:9200)
 *  - ELASTIC_USERNAME
 *  - ELASTIC_PASSWORD
 *  - PORT (default 4000)
 *
 * Endpoint:
 *  POST /api/orders  { customer: {...}, items: [...], total }
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ELASTIC_URL = process.env.ELASTIC_URL || 'http://localhost:9200';
const ELASTIC_USER = process.env.ELASTIC_USERNAME || '';
const ELASTIC_PASS = process.env.ELASTIC_PASSWORD || '';
const ORDERS_INDEX = process.env.ELASTIC_ORDERS_INDEX || 'orders';

const client = new Client({
  node: ELASTIC_URL,
  auth: ELASTIC_USER ? { username: ELASTIC_USER, password: ELASTIC_PASS } : undefined
});

async function ensureIndex() {
  try {
    const exists = await client.indices.exists({ index: ORDERS_INDEX });
    if (!exists) {
      console.log(`Index "${ORDERS_INDEX}" לא נמצא — ניצור ונטעין mapping`);
      const mappingPath = path.join(__dirname, 'elasticsearch-mapping.json');
      let mapping = {};
      if (fs.existsSync(mappingPath)) {
        mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
      }
      await client.indices.create({
        index: ORDERS_INDEX,
        body: mapping
      });
      console.log(`Index "${ORDERS_INDEX}" נוצר בהצלחה`);
    } else {
      console.log(`Index "${ORDERS_INDEX}" כבר קיים`);
    }
  } catch (err) {
    console.error("שגיאה בבדיקת/יצירת אינדקס:", err);
    throw err;
  }
}

async function start() {
  await ensureIndex();

  const app = express();
  app.use(cors({ origin: 'http://localhost:3000' })); // התאימי לפי צרכים
  app.use(bodyParser.json({ limit: '1mb' }));

  app.get('/health', (req, res) => res.send({ ok: true }));

  app.post('/api/orders', async (req, res) => {
    try {
      const payload = req.body;
      // בדיקות בסיסיות
      if (!payload || !payload.customer || !payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        return res.status(400).json({ error: 'payload לא תקין' });
      }
      const { customer, items, total } = payload;
      if (!customer.firstName || !customer.lastName || !customer.address || !customer.email) {
        return res.status(400).json({ error: 'שדות חובת הלקוח חסרים' });
      }

      const docId = uuidv4();
      const doc = {
        id: docId,
        customer,
        items,
        total: typeof total === 'number' ? total : items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0),
        createdAt: new Date().toISOString()
      };

      const r = await client.index({
        index: ORDERS_INDEX,
        id: docId,
        body: doc,
        refresh: 'wait_for'
      });

      return res.status(201).json({ result: r, id: docId });
    } catch (err) {
      console.error("Error saving order:", err);
      return res.status(500).json({ error: 'שגיאה בשמירת ההזמנה' });
    }
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Orders API listening on ${port}`));
}

start().catch(err => {
  console.error("Failed to start Orders API:", err);
  process.exit(1);
});