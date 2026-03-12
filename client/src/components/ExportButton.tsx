import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadHTML } from "@/lib/htmlExport";
import { toast } from "sonner";

interface ExportButtonProps {
  onExport: () => { html: string; filename: string; title: string };
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export default function ExportButton({ onExport, variant = "outline", size = "default" }: ExportButtonProps) {
  const { language } = useLanguage();

  const handleDownload = () => {
    try {
      const { html, filename } = onExport();
      downloadHTML(html, filename);
      toast.success(
        language === 'ar' 
          ? 'تم تنزيل الملف بنجاح' 
          : 'File downloaded successfully'
      );
    } catch (error) {
      toast.error(
        language === 'ar'
          ? 'فشل تنزيل الملف'
          : 'Failed to download file'
      );
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleDownload}>
      <Download className="w-4 h-4 mr-2" />
      {language === 'ar' ? 'تصدير HTML' : 'Export HTML'}
    </Button>
  );
}
