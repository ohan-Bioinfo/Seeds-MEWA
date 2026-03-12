/**
 * HTML Export Utility
 * Generates standalone HTML files with embedded styles and data for sharing
 */

export interface ExportOptions {
  title: string;
  content: string;
  styles?: string;
  includeHeader?: boolean;
  language?: 'en' | 'ar';
}

/**
 * Generate a complete standalone HTML document
 */
export function generateStandaloneHTML(options: ExportOptions): string {
  const { title, content, styles = '', includeHeader = true, language = 'en' } = options;
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const logoUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663143815567/GepFqmryaNTsXTiv.jpg';

  const headerHTML = includeHeader ? `
    <header style="background: linear-gradient(135deg, #1a5f3a 0%, #2d8659 100%); color: white; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; ${dir === 'rtl' ? 'flex-direction: row-reverse;' : ''}">
        <img src="${logoUrl}" alt="MEWA Logo" style="height: 60px; width: auto;" />
        <div>
          <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700;">${language === 'ar' ? 'مركز بيانات البذور' : 'Seed Center Data Hub'}</h1>
          <p style="margin: 0; font-size: 0.875rem; opacity: 0.9;">${language === 'ar' ? 'وزارة البيئة والمياه والزراعة' : 'Ministry of Environment, Water & Agriculture'}</p>
        </div>
      </div>
    </header>
  ` : '';

  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      ${language === 'ar' ? "font-family: 'Tajawal', 'Cairo', sans-serif;" : ''}
      line-height: 1.6;
      color: #1a1a1a;
      background: #f5f5f5;
      direction: ${dir};
    }
    
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      color: #1a5f3a;
      margin-bottom: 1rem;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    
    .stat-card {
      background: linear-gradient(135deg, #f0f9f4 0%, #e6f4ed 100%);
      border: 2px solid #2d8659;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a5f3a;
      margin: 0.5rem 0;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    
    th, td {
      padding: 0.75rem;
      text-align: ${dir === 'rtl' ? 'right' : 'left'};
      border-bottom: 1px solid #e0e0e0;
    }
    
    th {
      background: #f0f9f4;
      color: #1a5f3a;
      font-weight: 600;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .badge-success {
      background: #d4edda;
      color: #155724;
    }
    
    .badge-warning {
      background: #fff3cd;
      color: #856404;
    }
    
    .badge-danger {
      background: #f8d7da;
      color: #721c24;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5rem 0;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2d8659 0%, #1a5f3a 100%);
      transition: width 0.3s ease;
    }
    
    .footer {
      text-align: center;
      padding: 2rem 1rem;
      color: #666;
      font-size: 0.875rem;
      border-top: 1px solid #e0e0e0;
      margin-top: 3rem;
    }
    
    @media print {
      body {
        background: white;
      }
      .card {
        box-shadow: none;
        border: 1px solid #e0e0e0;
      }
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      .grid {
        grid-template-columns: 1fr;
      }
      table {
        font-size: 0.875rem;
      }
      th, td {
        padding: 0.5rem;
      }
    }
  `;

  return `<!DOCTYPE html>
<html lang="${language}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="MEWA Seed Center Dashboard - ${title}">
  <title>${title} - MEWA Seed Center</title>
  <style>
    ${baseStyles}
    ${styles}
  </style>
</head>
<body>
  ${headerHTML}
  <main class="container">
    ${content}
  </main>
  <footer class="footer">
    <p>${language === 'ar' ? 'وزارة البيئة والمياه والزراعة - المملكة العربية السعودية' : 'Ministry of Environment, Water & Agriculture - Kingdom of Saudi Arabia'}</p>
    <p style="margin-top: 0.5rem; opacity: 0.7;">${language === 'ar' ? 'تم التصدير من مركز بيانات البذور' : 'Exported from MEWA Seed Center Dashboard'} - ${new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
  </footer>
</body>
</html>`;
}

/**
 * Download HTML file to user's device
 */
export function downloadHTML(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Share HTML content via WhatsApp Web
 */
export function shareViaWhatsApp(message: string, fileUrl?: string) {
  const text = encodeURIComponent(message + (fileUrl ? `\n\n${fileUrl}` : ''));
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Generate shareable message for WhatsApp
 */
export function generateShareMessage(title: string, language: 'en' | 'ar' = 'en'): string {
  if (language === 'ar') {
    return `📊 *${title}*\n\nمن مركز بيانات البذور - وزارة البيئة والمياه والزراعة\n\nتم إنشاء هذا التقرير في ${new Date().toLocaleDateString('ar-SA')}`;
  }
  return `📊 *${title}*\n\nFrom MEWA Seed Center Dashboard\nMinistry of Environment, Water & Agriculture\n\nGenerated on ${new Date().toLocaleDateString('en-US')}`;
}
