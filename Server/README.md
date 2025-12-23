```markdown
# ShopApi (.NET 8 + EF Core) - Server for React client

מה יש כאן:
- Web API פשוט שמספק את הנתונים: GET /api/data (מחזיר categories + products).
- EF Core עם SQL Server; מיגרציות מופעלות בזמן ריצה ו־seeding לדמו.

דרישות:
- .NET 8 SDK
- SQL Server (או החליפי את ה־ConnectionString)

הרצה מקומית:
1. סדרי את מחרוזת החיבור בקובץ appsettings.json (DefaultConnection).
2. התקיני חבילות EF Tools אם צריך:
   dotnet tool install --global dotnet-ef
3. לביצוע מיגרציות ידניות (אופציונלי):
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   (או פשוט run — הקוד קורא db.Database.Migrate() ויעשה מיגרציה בזמן ריצה)
4. הרצת האפליקציה:
   dotnet run

ברירת מחדל: ה־API יאזין ל־http(s) ולפעמים על פורטים 5000/5001 (תראי את ה־output של dotnet run).
לקוח React (localhost:3000) מוגדר ב‑CORS.