"use client";
import { useState } from "react";
import { invoice } from "@prisma/client";
import DeleteDialog from "./delete-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersTable({ invoices }: { invoices: invoice[] }) {
  const [list, setList] = useState(invoices);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const allSelected = selectedIds.length === invoices.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map((invoice) => invoice.id));
    }
  };

  const handleDelete = (id: number) => {
    setList((prev) => prev.filter((invoice) => invoice.id !== id));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {list.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(invoice.id)}
                    onCheckedChange={() => toggleSelect(invoice.id)}
                    aria-label={`Select invoice ${invoice.id}`}
                  />
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.invoice}</TableCell>
                <TableCell>{invoice.payment_status}</TableCell>
                <TableCell>{invoice.payment_method}</TableCell>
                <TableCell className="text-right">
                  {invoice.total_amount}
                </TableCell>
                <TableCell className="text-center">
                  <DeleteDialog
                    id={invoice.id}
                    onDelete={handleDelete}
                    resource="invoices"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
