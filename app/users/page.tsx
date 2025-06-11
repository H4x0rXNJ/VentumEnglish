import UsersTable from "@/app/components/admin/users/UsersTable";

export default async function UsersPage() {
  const res = await fetch(`${process.env.PUBLIC_BASE_URL}/api/invoices`, {
    cache: "no-store",
  });
  const invoices = await res.json();

  return <UsersTable invoices={invoices} />;
}
