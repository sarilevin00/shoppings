using Microsoft.EntityFrameworkCore;
using ShopApi.Data;
using ShopApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure DB (SQL Server). החליפי את ה־ConnectionString ב־appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS - מאפשר קריאות מ־localhost:3000 (React dev server).
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// הפעלת מיגרציות ו‑seeding בזמן הריצה (נוח בפיתוח)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Categories.Any())
    {
        // Seeder בסיסי לדמו
        var fruits = new Category { Name = "פירות" };
        var vegs = new Category { Name = "ירקות" };
        var drinks = new Category { Name = "משקאות" };

        db.Categories.AddRange(fruits, vegs, drinks);
        db.Products.AddRange(
            new Product { Name = "תפוח", Category = fruits, Price = 3.5m },
            new Product { Name = "בננה", Category = fruits, Price = 2.5m },
            new Product { Name = "עגבניה", Category = vegs, Price = 4.0m },
            new Product { Name = "מלפפון", Category = vegs, Price = 3.0m },
            new Product { Name = "מים מינרליים", Category = drinks, Price = 5.0m },
            new Product { Name = "מיץ תפוחים", Category = drinks, Price = 7.0m }
        );
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactDev");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();