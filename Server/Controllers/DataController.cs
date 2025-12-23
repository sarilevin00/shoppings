using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopApi.Data;

namespace ShopApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : ControllerBase
    {
        private readonly AppDbContext _db;
        public DataController(AppDbContext db) => _db = db;

        // GET api/data
        // מחזיר אובייקט עם categories ו‑products (מתאים ללקוח הקיים)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _db.Categories
                .AsNoTracking()
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();

            var products = await _db.Products
                .AsNoTracking()
                .Select(p => new { p.Id, p.Name, p.CategoryId, p.Price })
                .ToListAsync();

            return Ok(new { categories, products });
        }

        // אופציונלי: GET api/data/categories/{id}/products
        [HttpGet("categories/{id}/products")]
        public async Task<IActionResult> GetProductsByCategory(int id)
        {
            var products = await _db.Products
                .Where(p => p.CategoryId == id)
                .AsNoTracking()
                .Select(p => new { p.Id, p.Name, p.CategoryId, p.Price })
                .ToListAsync();

            return Ok(products);
        }
    }
}