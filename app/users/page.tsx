import { PrismaClient } from "@prisma/client";
import UsersTable from "@/app/components/admin/users/UsersTable";

const prisma = new PrismaClient();

export default async function UsersPage() {
  const invoices = await prisma.invoice.findMany();
  return <UsersTable invoices={invoices} />;
}
