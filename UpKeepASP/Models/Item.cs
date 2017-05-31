
namespace UpKeepASP.Models
{
    public class Item
    {
        public int Id { get; set; }
        public int ListId { get; set; }
        public string Name { get; set; }
        public long Date { get; set; }
        public string Description { get; set; }
    }
}