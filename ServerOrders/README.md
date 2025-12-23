```markdown
Orders API (Express) + Elasticsearch
------------------------------------

דרישות:
- Node 18+
- Elasticsearch (להגדיר ELASTIC_URL env או להשתמש בברירת מחדל http://localhost:9200)

הגדרה והרצה:
1. העברי לתקייה ServerOrders
2. התקיני חבילות:
   npm install
3. הגדירי משתני סביבה (אופציונלי):
   ELASTIC_URL=http://localhost:9200
   ELASTIC_USERNAME=...
   ELASTIC_PASSWORD=...
   PORT=4000
4. הריצי:
   npm start

ה־API:
- POST /api/orders
  מקבל JSON עם מבנה:
  {
    customer: { firstName, lastName, address, email },
    items: [{ productId, name, price, quantity }, ...],
    total: <number>
  }
  ומחזיר id של ההזמנה.

הערה:
- יש קובץ mapping ב־elasticsearch-mapping.json המשמש ליצירת אינדקס orders.