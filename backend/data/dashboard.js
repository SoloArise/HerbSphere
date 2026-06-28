const dashboard = {
  period: "June 2026",
  metrics: [
    { label: "Total Revenue", value: "Rs. 84,320", sub: "+12% vs last month" },
    { label: "Total Orders", value: "1,247", sub: "+8% vs last month" },
    { label: "Inventory Items", value: "342", sub: "18 low stock alerts" },
  ],
  orders: [
    {
      id: "HS-2418",
      customer: "Maria Santos",
      product: "Ashwagandha Powder",
      amount: "Rs. 1,196",
      date: "Jun 19, 2026",
      status: "Fulfilled",
    },
    {
      id: "HS-2417",
      customer: "James Okafor",
      product: "Tulsi Green Tea",
      amount: "Rs. 796",
      date: "Jun 19, 2026",
      status: "Processing",
    },
    {
      id: "HS-2416",
      customer: "Priya Mehta",
      product: "Neem Face Pack",
      amount: "Rs. 747",
      date: "Jun 18, 2026",
      status: "Fulfilled",
    },
    {
      id: "HS-2415",
      customer: "Lena Novak",
      product: "Aloe Vera Gel",
      amount: "Rs. 540",
      date: "Jun 18, 2026",
      status: "Pending",
    },
    {
      id: "HS-2414",
      customer: "Tom Fischer",
      product: "Brahmi Hair Oil",
      amount: "Rs. 1,047",
      date: "Jun 17, 2026",
      status: "Fulfilled",
    },
  ],
};

module.exports = dashboard;
