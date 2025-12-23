namespace ShopApi.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        // ניווט — לא נדרש מצד הלקוח אבל נח לעבודה באחד ה‑endpoints
        public List<Product> Products { get; set; } = new();
    }
}