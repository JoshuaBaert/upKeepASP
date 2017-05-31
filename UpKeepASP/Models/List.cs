using System.Collections.Generic;

namespace UpKeepASP.Models
{
    public class List
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        public string Icon { get; set; }

        public IEnumerable<Item> Items { get; set; }
    }
}