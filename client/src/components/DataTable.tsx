/* Design Philosophy: Data-Driven Cartography with Agricultural Heritage
   Data Table: Scientific catalog presentation with JetBrains Mono for accession IDs
   Sortable columns, pagination, and export functionality
*/

import { useState } from 'react';
import { SeedPassport } from '@/types/data';
import { CROP_META } from '@/data/passportData';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface DataTableProps {
  data: SeedPassport[];
}

const ITEMS_PER_PAGE = 20;

export default function DataTable({ data }: DataTableProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<SeedPassport | null>(null);
  
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);
  
  const handleExport = () => {
    const headers = ['Accession ID', 'Crop', 'Local Name', 'Arabic Name', 'Scientific Name', 'Country', 'Province', 'Location', 'Source'];
    const rows = data.map(item => [
      item.accessionId,
      item.cropType,
      item.localName,
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
          <span className="hidden sm:inline"> · {isAr ? 'انقر صفاً لعرض التفاصيل' : 'click a row for details'}</span>
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
      
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Accession ID</TableHead>
              <TableHead className="font-semibold">Crop</TableHead>
              <TableHead className="font-semibold">Local Name</TableHead>
              <TableHead className="font-semibold">Scientific Name</TableHead>
              <TableHead className="font-semibold">Source / Donor</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/30 cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <TableCell className="font-mono text-sm font-medium">
                  {item.accessionId}
                </TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${CROP_META[item.cropType].color}22`,
                      color: CROP_META[item.cropType].color,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CROP_META[item.cropType].color }}
                    ></span>
                    {language === "ar"
                      ? CROP_META[item.cropType].labelAr
                      : CROP_META[item.cropType].label}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{item.localName || item.arabicName || "—"}</TableCell>
                <TableCell className="text-sm italic">{item.scientificName}</TableCell>
                <TableCell className="text-sm">{item.source || "—"}</TableCell>
                <TableCell className="text-sm">{item.country}</TableCell>
                <TableCell className="text-sm">{item.province || "—"}</TableCell>
                <TableCell className="text-sm">{item.location || "—"}</TableCell>
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

      {/* Accession detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg" dir={isAr ? 'rtl' : 'ltr'}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-mono">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${CROP_META[selected.cropType].color}22`,
                      color: CROP_META[selected.cropType].color,
                    }}
                  >
                    <span>{CROP_META[selected.cropType].icon}</span>
                    {isAr
                      ? CROP_META[selected.cropType].labelAr
                      : CROP_META[selected.cropType].label}
                  </span>
                  {selected.accessionId}
                </DialogTitle>
              </DialogHeader>
              <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm mt-2">
                {[
                  { label: isAr ? 'الاسم المحلي' : 'Local Name', val: selected.localName },
                  { label: isAr ? 'الاسم العربي' : 'Arabic Name', val: selected.arabicName },
                  { label: isAr ? 'الجنس' : 'Genus', val: selected.genus },
                  { label: isAr ? 'النوع' : 'Species', val: selected.species },
                  { label: isAr ? 'الاسم العلمي' : 'Scientific Name', val: selected.scientificName, italic: true },
                  { label: isAr ? 'المصدر / المانح' : 'Source / Donor', val: selected.source },
                  { label: isAr ? 'الدولة' : 'Country', val: selected.country },
                  { label: isAr ? 'موقع الجمع' : 'Collection Site', val: selected.province },
                  { label: isAr ? 'المنطقة' : 'Region', val: selected.location },
                ].map(({ label, val, italic }) => (
                  <div key={label} className="contents">
                    <dt className="col-span-1 text-muted-foreground">{label}</dt>
                    <dd className={`col-span-2 font-medium break-words ${italic ? 'italic' : ''}`}>
                      {val || '—'}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
