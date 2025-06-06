"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import '@/app/users/simple-delete.css';

type Props = {
    id: number;
    resource: string
    onDelete?: (id: number) => void;
};

export default function DeleteDialog({id, resource, onDelete}: Props) {
    const handleDelete = async () => {
        const res = await fetch(`/api/${resource}/${id}`, {method: 'DELETE'});
        if (res.ok) {
            onDelete?.(id);
        } else {
            try {
                const data = await res.json();
                console.log(`Failed to delete: ${data.error}`);
            } catch {
                console.log('Failed to delete: Unknown error');
            }
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
<span className="block w-full cursor-pointer select-none rounded px-3 py-1 pl-1 text-left text-sm text-red-600 hover:bg-red-100">
  Delete
</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the invoice.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
