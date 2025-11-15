
using Laczynski.ChangeMe.Backend.Core.ItemsAggregate;
using Microsoft.EntityFrameworkCore;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Data;

public static class SeedData
{

  public static async Task InitializeAsync(ApplicationDbContext dbContext)
  {
    if (await dbContext.Items.AnyAsync()) return;

    await PopulateTestDataAsync(dbContext);
  }

  public static async Task PopulateTestDataAsync(ApplicationDbContext dbContext)
  {

    var items = new List<Item>
    {
      new Item("Item 1", "Description 1", 100, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 2", "Description 2", 200, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 3", "Description 3", 300, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 4", "Description 4", 400, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 5", "Description 5", 500, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 6", "Description 6", 600, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 7", "Description 7", 700, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 8", "Description 8", 800, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 9", "Description 9", 900, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 10", "Description 10", 1000, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 11", "Description 11", 1100, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 12", "Description 12", 1200, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 13", "Description 13", 1300, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 14", "Description 14", 1400, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 15", "Description 15", 1500, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 16", "Description 16", 1600, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 17", "Description 17", 1700, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 18", "Description 18", 1800, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 19", "Description 19", 1900, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 20", "Description 20", 2000, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 21", "Description 21", 2100, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 22", "Description 22", 2200, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 23", "Description 23", 2300, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 24", "Description 24", 2400, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 25", "Description 25", 2500, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 26", "Description 26", 2600, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 27", "Description 27", 2700, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 28", "Description 28", 2800, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 29", "Description 29", 2900, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
      new Item("Item 30", "Description 30", 3000, "https://i.imgur.com/mszbfO5_d.webp?maxwidth=520&shape=thumb&fidelity=high"),
    };

    await dbContext.Items.AddRangeAsync(items);
    await dbContext.SaveChangesAsync();
  }
}
