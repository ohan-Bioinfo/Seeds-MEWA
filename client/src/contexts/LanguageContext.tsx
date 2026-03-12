import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar'; // Default to Arabic
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Data Catalog',
    'nav.genomics': 'Genomics Hub',
    'nav.exchange': 'Seeders Exchange',
    'nav.research': 'Research Hub',
    'nav.community': 'Community',
    'nav.contact': 'Contact',
    'nav.centers': 'Seed Centers',
    'nav.inventory': 'Inventory Tracking',
    'nav.publicAccess': 'Public Access',

    // Header
    'header.title': 'Seed Center Data Hub',
    'header.subtitle': 'Ministry of Environment, Water & Agriculture',

    // Home Page
    'home.hero.title': "Explore Saudi Arabia's Seed Genetic Resources",
    'home.hero.description': 'Discover passport data for 8 crops (wheat, coffee, barley, millet, sorghum, sesame, faba bean, mango) across nine Saudi regions. Filter by crop type, region, and accession details to support breeding and agricultural research.',
    'home.stats.total': 'Total Samples',
    'home.stats.totalDesc': 'Across all regions',
    'home.stats.wheat': 'Wheat Accessions',
    'home.stats.wheatDesc': 'Triticum species',
    'home.stats.coffee': 'Coffee Accessions',
    'home.stats.coffeeDesc': 'Coffea arabica',
    'home.map.title': 'Regional Distribution',
    'home.map.description': 'Interactive map showing seed collection sites across Saudi Arabia',
    'home.catalog.title': 'Data Catalog',
    'home.catalog.description': 'Browse complete seed passport database',

    // Home badges & labels
    'home.badge.totalAccessions': 'Total Accessions',
    'home.badge.cropsWithData': 'Crops with Passport Data',
    'home.badge.saudiRegions': 'Saudi Regions',
    'home.label.accessions': 'accessions',
    'home.label.activeRegions': 'Active regions',
    'home.label.saudiAccessions': 'Saudi accessions',
    'home.label.filteringBy': 'Filtering by:',
    'home.label.clearAll': 'Clear all',
    'home.label.showingSaudi': 'Showing {n} Saudi accessions',
    'home.label.clickRegion': 'Click a region marker to highlight it. Click crop tiles above to filter.',
    'home.label.domCropColor': '(Marker color = dominant crop in region)',
    'home.label.passportSummary': 'Passport Summary',
    'home.label.clickToExplore': 'Click a region on the map or a crop tile to explore',
    'home.label.totalAccessions': 'Total accessions',
    'home.label.saudiCount': 'Saudi',
    'home.label.noteMappedRegions': 'Saudi accessions from this region with passport data. International accessions (CIMMYT, ICARDA, etc.) are not shown geographically.',
    'home.label.regionBreakdown': 'Region Breakdown',

    // Data Catalog
    'catalog.title': 'Data Catalog',
    'catalog.description': 'Browse, search, and export comprehensive seed passport data from MEWA collections',
    'catalog.totalRecords': 'Total Records',
    'catalog.allAccessions': 'All accessions',
    'catalog.wheat': 'Wheat',
    'catalog.triticum': 'Triticum accessions',
    'catalog.coffee': 'Coffee',
    'catalog.coffea': 'Coffea accessions',
    'catalog.exportData': 'Export Data',
    'catalog.fingerprints': 'Genetic Fingerprint Database',
    'catalog.fingerprintsDesc': 'Access molecular markers, DNA barcodes, and genetic fingerprints for all accessions',
    'catalog.viewFingerprints': 'View Fingerprints',
    'catalog.filters': 'Filters',
    'catalog.search': 'Search',
    'catalog.searchPlaceholder': 'Accession ID, location...',
    'catalog.cropType': 'Crop Type',
    'catalog.regions': 'Saudi Regions',
    'catalog.showing': 'Showing',
    'catalog.of': 'of',
    'catalog.samples': 'samples',
    'catalog.exportCSV': 'Export CSV',
    'catalog.accessionId': 'Accession ID',
    'catalog.crop': 'Crop',
    'catalog.arabicName': 'Arabic Name',
    'catalog.scientificName': 'Scientific Name',
    'catalog.country': 'Country',
    'catalog.region': 'Region',
    'catalog.location': 'Location',

    // Genetic Fingerprints
    'fingerprints.title': 'Genetic Fingerprints',
    'fingerprints.description': 'Comprehensive molecular marker profiles and DNA barcodes for all MEWA seed accessions',
    'fingerprints.totalFingerprints': 'Total Fingerprints',
    'fingerprints.completeProfiles': 'Complete profiles',
    'fingerprints.ssrMarkers': 'SSR Markers',
    'fingerprints.acrossAccessions': 'Across all accessions',
    'fingerprints.dnaBarcodes': 'DNA Barcodes',
    'fingerprints.uniqueIdentifiers': 'Unique identifiers',
    'fingerprints.genotypedLoci': 'Genotyped Loci',
    'fingerprints.perAccession': 'Per accession',
    'fingerprints.searchTitle': 'Search Genetic Fingerprints',
    'fingerprints.searchDesc': 'Find molecular marker profiles by accession ID or local name',
    'fingerprints.searchPlaceholder': 'Search by accession ID or name...',
    'fingerprints.all': 'All',
    'fingerprints.database': 'Fingerprint Database',
    'fingerprints.accessions': 'accessions',
    'fingerprints.export': 'Export',
    'fingerprints.dnaBarcode': 'DNA Barcode',
    'fingerprints.ssrProfile': 'SSR Profile',
    'fingerprints.geneticBarcode': 'Genetic Barcode',
    'fingerprints.ssrMarkerProfile': 'SSR Marker Profile',
    'fingerprints.showingOf': 'Showing',
    'fingerprints.loadMore': 'Load More',
    'fingerprints.noResults': 'No fingerprints found',
    'fingerprints.noResultsDesc': 'Try adjusting your search criteria or filters',

    // Genomics Hub
    'genomics.title': 'Genomics Hub',
    'genomics.description': 'Access genetic sequences, molecular markers, and bioinformatics tools',

    // Seeders Exchange
    'exchange.title': 'Seeders Exchange',
    'exchange.description': 'Request seeds and access germplasm collections',

    // Research Hub
    'research.title': 'Research Hub',
    'research.description': 'Publications, projects, and breeding programs',

    // Community
    'community.title': 'Scientific Community',
    'community.description': 'Connect with researchers and breeders',

    // Contact
    'contact.title': 'Contact Us',
    'contact.description': 'Get in touch with MEWA Seed Center',

    // About
    'about.title': 'About MEWA Seed Center',
    'about.description': 'Our mission and vision',

    // Footer
    'footer.title': 'MEWA Seed Center',
    'footer.subtitle': 'Ministry of Environment, Water & Agriculture',
    'footer.country': 'Kingdom of Saudi Arabia',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.email': 'Email: info@mewa.gov.sa',
    'footer.phone': 'Phone: +966 11 XXX XXXX',
    'footer.contactForm': 'Contact Form',
    'footer.rights': '© 2026 Ministry of Environment, Water & Agriculture. All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.reset': 'Reset',
    'common.apply': 'Apply',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.first': 'First',
    'common.last': 'Last',
    'common.page': 'Page',
    'common.perPage': 'per page',
    'common.total': 'Total',
    'common.selected': 'selected',
    'common.all': 'All',
    'common.none': 'None',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.crops': 'Crops',
    'common.staff': 'Staff',
    'common.employees': 'employees',
    'common.centers': 'Centers',
    'common.viewDetails': 'View Details',

    // Regions
    'region.taif': 'Taif',
    'region.aseer': 'Aseer',
    'region.albaha': 'Al-Baha',
    'region.najran': 'Najran',
    'region.riyadh': 'Riyadh',
    'region.qaseem': 'Qaseem',
    'region.hail': 'Hail',
    'region.jazan': 'Jazan',
    'region.tabuk': 'Tabuk',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.catalog': 'كتالوج البيانات',
    'nav.genomics': 'مركز الجينوم',
    'nav.exchange': 'تبادل البذور',
    'nav.research': 'مركز الأبحاث',
    'nav.community': 'المجتمع العلمي',
    'nav.contact': 'اتصل بنا',
    'nav.centers': 'مراكز البذور',
    'nav.inventory': 'تتبع المخزون',
    'nav.publicAccess': 'وصول عام',

    // Header
    'header.title': 'مركز بيانات البذور',
    'header.subtitle': 'وزارة البيئة والمياه والزراعة',

    // Home Page
    'home.hero.title': 'استكشف الموارد الوراثية للبذور في المملكة العربية السعودية',
    'home.hero.description': 'اكتشف بيانات جواز السفر لـ 8 محاصيل (قمح، بن، شعير، دخن، ذرة رفيعة، سمسم، فول، مانجو) عبر تسع مناطق سعودية. قم بالتصفية حسب نوع المحصول والمنطقة وتفاصيل الانضمام لدعم أبحاث التربية والزراعة.',
    'home.stats.total': 'إجمالي العينات',
    'home.stats.totalDesc': 'عبر جميع المناطق',
    'home.stats.wheat': 'انضمامات القمح',
    'home.stats.wheatDesc': 'أنواع القمح',
    'home.stats.coffee': 'انضمامات البن',
    'home.stats.coffeeDesc': 'البن العربي',
    'home.map.title': 'التوزيع الإقليمي',
    'home.map.description': 'خريطة تفاعلية توضح مواقع جمع البذور في المملكة العربية السعودية',
    'home.catalog.title': 'كتالوج البيانات',
    'home.catalog.description': 'تصفح قاعدة بيانات جواز السفر الكاملة للبذور',

    // Home badges & labels
    'home.badge.totalAccessions': 'إجمالي الاعتمادات',
    'home.badge.cropsWithData': 'محاصيل بيانات جواز السفر',
    'home.badge.saudiRegions': 'منطقة سعودية',
    'home.label.accessions': 'اعتماد',
    'home.label.activeRegions': 'مناطق نشطة',
    'home.label.saudiAccessions': 'اعتماد سعودي',
    'home.label.filteringBy': 'تصفية حسب:',
    'home.label.clearAll': 'مسح الكل',
    'home.label.showingSaudi': 'عرض {n} اعتماد سعودي',
    'home.label.clickRegion': 'انقر على علامة منطقة لتمييزها. انقر على بلاطات المحاصيل للتصفية.',
    'home.label.domCropColor': '(لون العلامة = المحصول السائد في المنطقة)',
    'home.label.passportSummary': 'ملخص جواز السفر',
    'home.label.clickToExplore': 'انقر على منطقة في الخريطة أو بلاطة محصول للاستكشاف',
    'home.label.totalAccessions': 'إجمالي الاعتمادات',
    'home.label.saudiCount': 'سعودي',
    'home.label.noteMappedRegions': 'اعتمادات سعودية من هذه المنطقة ببيانات جواز السفر. الاعتمادات الدولية (CIMMYT، ICARDA، إلخ) غير مُعروضة جغرافياً.',
    'home.label.regionBreakdown': 'توزيع المناطق',

    // Data Catalog
    'catalog.title': 'كتالوج البيانات',
    'catalog.description': 'تصفح وابحث وصدّر بيانات جواز السفر الشاملة للبذور من مجموعات وزارة البيئة والمياه والزراعة',
    'catalog.totalRecords': 'إجمالي السجلات',
    'catalog.allAccessions': 'جميع الانضمامات',
    'catalog.wheat': 'القمح',
    'catalog.triticum': 'انضمامات القمح',
    'catalog.coffee': 'البن',
    'catalog.coffea': 'انضمامات البن',
    'catalog.exportData': 'تصدير البيانات',
    'catalog.fingerprints': 'قاعدة بيانات البصمات الوراثية',
    'catalog.fingerprintsDesc': 'الوصول إلى المؤشرات الجزيئية والرموز الشريطية للحمض النووي والبصمات الوراثية لجميع الانضمامات',
    'catalog.viewFingerprints': 'عرض البصمات',
    'catalog.filters': 'الفلاتر',
    'catalog.search': 'بحث',
    'catalog.searchPlaceholder': 'رقم الانضمام، الموقع...',
    'catalog.cropType': 'نوع المحصول',
    'catalog.regions': 'المناطق السعودية',
    'catalog.showing': 'عرض',
    'catalog.of': 'من',
    'catalog.samples': 'عينة',
    'catalog.exportCSV': 'تصدير CSV',
    'catalog.accessionId': 'رقم الانضمام',
    'catalog.crop': 'المحصول',
    'catalog.arabicName': 'الاسم العربي',
    'catalog.scientificName': 'الاسم العلمي',
    'catalog.country': 'الدولة',
    'catalog.region': 'المنطقة',
    'catalog.location': 'الموقع',

    // Genetic Fingerprints
    'fingerprints.title': 'البصمات الوراثية',
    'fingerprints.description': 'ملفات تعريف المؤشرات الجزيئية الشاملة والرموز الشريطية للحمض النووي لجميع انضمامات بذور وزارة البيئة والمياه والزراعة',
    'fingerprints.totalFingerprints': 'إجمالي البصمات',
    'fingerprints.completeProfiles': 'ملفات تعريف كاملة',
    'fingerprints.ssrMarkers': 'مؤشرات SSR',
    'fingerprints.acrossAccessions': 'عبر جميع الانضمامات',
    'fingerprints.dnaBarcodes': 'الرموز الشريطية للحمض النووي',
    'fingerprints.uniqueIdentifiers': 'معرفات فريدة',
    'fingerprints.genotypedLoci': 'المواقع الجينية المحددة',
    'fingerprints.perAccession': 'لكل انضمام',
    'fingerprints.searchTitle': 'البحث في البصمات الوراثية',
    'fingerprints.searchDesc': 'ابحث عن ملفات تعريف المؤشرات الجزيئية حسب رقم الانضمام أو الاسم المحلي',
    'fingerprints.searchPlaceholder': 'البحث برقم الانضمام أو الاسم...',
    'fingerprints.all': 'الكل',
    'fingerprints.database': 'قاعدة بيانات البصمات',
    'fingerprints.accessions': 'انضمام',
    'fingerprints.export': 'تصدير',
    'fingerprints.dnaBarcode': 'الرمز الشريطي للحمض النووي',
    'fingerprints.ssrProfile': 'ملف تعريف SSR',
    'fingerprints.geneticBarcode': 'الرمز الشريطي الوراثي',
    'fingerprints.ssrMarkerProfile': 'ملف تعريف مؤشر SSR',
    'fingerprints.showingOf': 'عرض',
    'fingerprints.loadMore': 'تحميل المزيد',
    'fingerprints.noResults': 'لم يتم العثور على بصمات',
    'fingerprints.noResultsDesc': 'حاول تعديل معايير البحث أو الفلاتر',

    // Genomics Hub
    'genomics.title': 'مركز الجينوم',
    'genomics.description': 'الوصول إلى التسلسلات الجينية والمؤشرات الجزيئية وأدوات المعلوماتية الحيوية',

    // Seeders Exchange
    'exchange.title': 'تبادل البذور',
    'exchange.description': 'طلب البذور والوصول إلى مجموعات البلازما الجرثومية',

    // Research Hub
    'research.title': 'مركز الأبحاث',
    'research.description': 'المنشورات والمشاريع وبرامج التربية',

    // Community
    'community.title': 'المجتمع العلمي',
    'community.description': 'تواصل مع الباحثين والمربين',

    // Contact
    'contact.title': 'اتصل بنا',
    'contact.description': 'تواصل مع مركز بذور وزارة البيئة والمياه والزراعة',

    // About
    'about.title': 'عن مركز بذور وزارة البيئة والمياه والزراعة',
    'about.description': 'مهمتنا ورؤيتنا',

    // Footer
    'footer.title': 'مركز البذور - وزارة البيئة',
    'footer.subtitle': 'وزارة البيئة والمياه والزراعة',
    'footer.country': 'المملكة العربية السعودية',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.email': 'البريد الإلكتروني: info@mewa.gov.sa',
    'footer.phone': 'الهاتف: +966 11 XXX XXXX',
    'footer.contactForm': 'نموذج الاتصال',
    'footer.rights': '© 2026 وزارة البيئة والمياه والزراعة. جميع الحقوق محفوظة.',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.download': 'تحميل',
    'common.upload': 'رفع',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.reset': 'إعادة تعيين',
    'common.apply': 'تطبيق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.first': 'الأول',
    'common.last': 'الأخير',
    'common.page': 'صفحة',
    'common.perPage': 'لكل صفحة',
    'common.total': 'المجموع',
    'common.selected': 'محدد',
    'common.all': 'الكل',
    'common.none': 'لا شيء',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.crops': 'المحاصيل',
    'common.staff': 'الموظفون',
    'common.employees': 'موظف',
    'common.centers': 'مركز',
    'common.viewDetails': 'عرض التفاصيل',

    // Regions
    'region.taif': 'الطائف',
    'region.aseer': 'عسير',
    'region.albaha': 'الباحة',
    'region.najran': 'نجران',
    'region.riyadh': 'الرياض',
    'region.qaseem': 'القصيم',
    'region.hail': 'حائل',
    'region.jazan': 'جازان',
    'region.tabuk': 'تبوك',
  },
};
