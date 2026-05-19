import { db } from "@/db";
import { OrdersListClient, OrderStatus } from "@/components/dashboard/OrdersListClient";

export const revalidate = 0; // force dynamic rendering

export default async function OrdersPage() {
  const dbOrders = await db.query.orders.findMany({
    orderBy: (orders, { desc }) => [desc(orders.id)],
  });

  const ordersData = dbOrders.map((o) => ({
    id: o.id,
    customer: o.customer,
    items: o.items,
    total: o.total,
    status: o.status as OrderStatus,
    date: o.date,
    destination: o.destination,
  }));

  return <OrdersListClient initialOrders={ordersData} />;
}
