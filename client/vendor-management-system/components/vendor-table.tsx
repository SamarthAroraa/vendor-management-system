import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Vendor } from "@/types/vendor";

interface VendorTableProps {
  vendors: Vendor[];
}

export default function VendorTable({ vendors }: VendorTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {vendors.length > 0 && (
              <>
                {Object.keys(vendors[0]).map(
                  (key) =>
                    key !== "id" && (
                      <TableHead key={key} className="text-right">
                        {key.replace(/([A-Z])/g, " $1")}
                      </TableHead>
                    )
                )}
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No vendor data available
              </TableCell>
            </TableRow>
          ) : (
            vendors.map((vendor, index) => (
              <TableRow key={vendor.id}>
                {Object.keys(vendor).map(
                  (key) =>
                    key !== "id" && (
                      <TableCell key={key} className="text-right">
                        {vendor[key]}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
