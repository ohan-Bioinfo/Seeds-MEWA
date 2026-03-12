/* Design Philosophy: Data-Driven Cartography with Agricultural Heritage
   Data Table: Scientific catalog presentation with JetBrains Mono for accession IDs
   Sortable columns, pagination, and export functionality
*/

import { useState } from 'react';
import { SeedPassport } from '@/types/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface DataTableProps {
  data: SeedPassport[];
}

const ITEMS_PER_PAGE = 20;

export default function DataTable({ data }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);
  
  const handleExport = () => {
    const headers = ['Accession ID', 'Crop', 'Arabic Name', 'Scientific Name', 'Country', 'Province', 'Location', 'Source'];
    const rows = data.map(item => [
      item.accessionId,
      item.cropType,
      item.arabicName,
      item.scientificName,
      item.country,
      item.province,
      item.location,
      item.source
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seed-passport-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} samples
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Accession ID</TableHead>
              <TableHead className="font-semibold">Crop</TableHead>
              <TableHead className="font-semibold">Arabic Name</TableHead>
              <TableHead className="font-semibold">Scientific Name</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm font-medium">
                  {item.accessionId}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    item.cropType === 'wheat' 
                      ? 'bg-[#D4A574]/20 text-[#B88A5E]' 
                      : 'bg-[#6B4423]/20 text-[#6B4423]'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.cropType === 'wheat' ? 'bg-[#D4A574]' : 'bg-[#6B4423]'
                    }`}></span>
                    {item.cropType}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{item.arabicName}</TableCell>
                <TableCell className="text-sm italic">{item.scientificName}</TableCell>
                <TableCell className="text-sm">{item.country}</TableCell>
                <TableCell className="text-sm">{item.province}</TableCell>
                <TableCell className="text-sm">{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="w-8"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
