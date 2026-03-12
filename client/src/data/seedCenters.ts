export interface SeedCenter {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  established: string;
  area: string; // in hectares
  staff: number;
  crops: {
    name: string;
    nameAr: string;
    area: string;
    varieties: number;
    plantingSeason: string;
  }[];
  activities: {
    type: 'breeding' | 'conservation' | 'distribution' | 'research' | 'training';
    description: string;
    descriptionAr: string;
  }[];
  seedExchange: {
    distributed: number; // kg per year
    received: number;
    partners: string[];
  };
  tracking: {
    accessionsStored: number;
    germplasmTypes: string[];
    storageCapacity: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    addressAr: string;
  };
}

export const seedCenters: SeedCenter[] = [
  // Taif Region
  {
    id: 'taif-001',
    name: 'Taif Agricultural Research Center',
    nameAr: 'مركز أبحاث الطائف الزراعي',
    region: 'Taif',
    city: 'Taif',
    coordinates: { lat: 21.2703, lng: 40.4158 },
    established: '2010',
    area: '45 hectares',
    staff: 28,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '15 ha', varieties: 12, plantingSeason: 'November-December' },
      { name: 'Barley', nameAr: 'الشعير', area: '10 ha', varieties: 8, plantingSeason: 'October-November' },
      { name: 'Pomegranate', nameAr: 'الرمان', area: '8 ha', varieties: 5, plantingSeason: 'Year-round' }
    ],
    activities: [
      { type: 'breeding', description: 'Drought-resistant wheat breeding program', descriptionAr: 'برنامج تربية القمح المقاوم للجفاف' },
      { type: 'research', description: 'Climate adaptation studies', descriptionAr: 'دراسات التكيف المناخي' },
      { type: 'distribution', description: 'Certified seed distribution to local farmers', descriptionAr: 'توزيع البذور المعتمدة للمزارعين المحليين' }
    ],
    seedExchange: {
      distributed: 12500,
      received: 3200,
      partners: ['ICARDA', 'Local Cooperatives', 'Riyadh Center']
    },
    tracking: {
      accessionsStored: 156,
      germplasmTypes: ['Wheat', 'Barley', 'Fruit crops'],
      storageCapacity: '5000 accessions'
    },
    contact: {
      phone: '+966-12-7345678',
      email: 'taif.center@mewa.gov.sa',
      address: 'Al-Hada Road, Taif 26571',
      addressAr: 'طريق الهدا، الطائف 26571'
    }
  },
  {
    id: 'taif-002',
    name: 'Taif Rose & Aromatic Plants Center',
    nameAr: 'مركز الورد والنباتات العطرية بالطائف',
    region: 'Taif',
    city: 'Al-Hada',
    coordinates: { lat: 21.3789, lng: 40.3245 },
    established: '2015',
    area: '22 hectares',
    staff: 15,
    crops: [
      { name: 'Rose', nameAr: 'الورد', area: '12 ha', varieties: 18, plantingSeason: 'March-April' },
      { name: 'Lavender', nameAr: 'الخزامى', area: '6 ha', varieties: 4, plantingSeason: 'Spring' },
      { name: 'Herbs', nameAr: 'الأعشاب', area: '4 ha', varieties: 10, plantingSeason: 'Year-round' }
    ],
    activities: [
      { type: 'conservation', description: 'Traditional Taif rose preservation', descriptionAr: 'الحفاظ على ورد الطائف التقليدي' },
      { type: 'breeding', description: 'Aromatic plant variety development', descriptionAr: 'تطوير أصناف النباتات العطرية' },
      { type: 'training', description: 'Farmer training on rose cultivation', descriptionAr: 'تدريب المزارعين على زراعة الورد' }
    ],
    seedExchange: {
      distributed: 8500,
      received: 1200,
      partners: ['International Rose Society', 'European Herb Gardens']
    },
    tracking: {
      accessionsStored: 89,
      germplasmTypes: ['Rose varieties', 'Aromatic plants', 'Medicinal herbs'],
      storageCapacity: '2000 accessions'
    },
    contact: {
      phone: '+966-12-7456789',
      email: 'rose.center@mewa.gov.sa',
      address: 'Al-Hada, Taif 26572',
      addressAr: 'الهدا، الطائف 26572'
    }
  },

  // Aseer Region
  {
    id: 'aseer-001',
    name: 'Abha Highland Agriculture Center',
    nameAr: 'مركز أبها للزراعة المرتفعة',
    region: 'Aseer',
    city: 'Abha',
    coordinates: { lat: 18.2164, lng: 42.5053 },
    established: '2008',
    area: '60 hectares',
    staff: 35,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '20 ha', varieties: 15, plantingSeason: 'November-January' },
      { name: 'Coffee', nameAr: 'البن', area: '18 ha', varieties: 12, plantingSeason: 'Year-round' },
      { name: 'Fruits', nameAr: 'الفواكه', area: '15 ha', varieties: 20, plantingSeason: 'Spring' }
    ],
    activities: [
      { type: 'breeding', description: 'High-altitude crop adaptation', descriptionAr: 'تكييف المحاصيل للمرتفعات' },
      { type: 'research', description: 'Coffee quality improvement program', descriptionAr: 'برنامج تحسين جودة البن' },
      { type: 'conservation', description: 'Indigenous variety preservation', descriptionAr: 'الحفاظ على الأصناف المحلية' }
    ],
    seedExchange: {
      distributed: 18000,
      received: 5500,
      partners: ['ICARDA', 'Coffee Research Institute', 'Jazan Center']
    },
    tracking: {
      accessionsStored: 234,
      germplasmTypes: ['Wheat', 'Coffee', 'Fruit trees', 'Vegetables'],
      storageCapacity: '8000 accessions'
    },
    contact: {
      phone: '+966-17-2234567',
      email: 'abha.center@mewa.gov.sa',
      address: 'King Fahd Road, Abha 62521',
      addressAr: 'طريق الملك فهد، أبها 62521'
    }
  },
  {
    id: 'aseer-002',
    name: 'Khamis Mushait Seed Production Center',
    nameAr: 'مركز إنتاج البذور بخميس مشيط',
    region: 'Aseer',
    city: 'Khamis Mushait',
    coordinates: { lat: 18.3000, lng: 42.7333 },
    established: '2012',
    area: '38 hectares',
    staff: 22,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '18 ha', varieties: 10, plantingSeason: 'November-December' },
      { name: 'Vegetables', nameAr: 'الخضروات', area: '12 ha', varieties: 25, plantingSeason: 'Year-round' },
      { name: 'Legumes', nameAr: 'البقوليات', area: '8 ha', varieties: 8, plantingSeason: 'Winter' }
    ],
    activities: [
      { type: 'distribution', description: 'Certified seed production and distribution', descriptionAr: 'إنتاج وتوزيع البذور المعتمدة' },
      { type: 'training', description: 'Farmer capacity building programs', descriptionAr: 'برامج بناء قدرات المزارعين' },
      { type: 'research', description: 'Seed quality testing laboratory', descriptionAr: 'مختبر اختبار جودة البذور' }
    ],
    seedExchange: {
      distributed: 15000,
      received: 2800,
      partners: ['Regional Cooperatives', 'Abha Center', 'Najran Center']
    },
    tracking: {
      accessionsStored: 178,
      germplasmTypes: ['Cereals', 'Vegetables', 'Legumes'],
      storageCapacity: '6000 accessions'
    },
    contact: {
      phone: '+966-17-2345678',
      email: 'khamis.center@mewa.gov.sa',
      address: 'Industrial Area, Khamis Mushait 62413',
      addressAr: 'المنطقة الصناعية، خميس مشيط 62413'
    }
  },

  // Al-Baha Region
  {
    id: 'baha-001',
    name: 'Al-Baha Mountain Agriculture Center',
    nameAr: 'مركز الباحة للزراعة الجبلية',
    region: 'Al-Baha',
    city: 'Al-Baha',
    coordinates: { lat: 20.0129, lng: 41.4677 },
    established: '2011',
    area: '35 hectares',
    staff: 20,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '12 ha', varieties: 8, plantingSeason: 'November-December' },
      { name: 'Coffee', nameAr: 'البن', area: '10 ha', varieties: 7, plantingSeason: 'Year-round' },
      { name: 'Honey Plants', nameAr: 'نباتات العسل', area: '8 ha', varieties: 15, plantingSeason: 'Spring' }
    ],
    activities: [
      { type: 'conservation', description: 'Mountain ecosystem biodiversity preservation', descriptionAr: 'الحفاظ على التنوع البيولوجي للنظام الجبلي' },
      { type: 'breeding', description: 'Terraced farming crop development', descriptionAr: 'تطوير محاصيل الزراعة المدرجة' },
      { type: 'research', description: 'Sustainable mountain agriculture research', descriptionAr: 'أبحاث الزراعة الجبلية المستدامة' }
    ],
    seedExchange: {
      distributed: 9500,
      received: 3100,
      partners: ['Aseer Center', 'Taif Center', 'Mountain Farmers Association']
    },
    tracking: {
      accessionsStored: 145,
      germplasmTypes: ['Wheat', 'Coffee', 'Honey plants', 'Native species'],
      storageCapacity: '4500 accessions'
    },
    contact: {
      phone: '+966-17-7234567',
      email: 'baha.center@mewa.gov.sa',
      address: 'Al-Aqiq, Al-Baha 65527',
      addressAr: 'العقيق، الباحة 65527'
    }
  },

  // Najran Region
  {
    id: 'najran-001',
    name: 'Najran Desert Agriculture Research Station',
    nameAr: 'محطة نجران لأبحاث الزراعة الصحراوية',
    region: 'Najran',
    city: 'Najran',
    coordinates: { lat: 17.4924, lng: 44.1277 },
    established: '2009',
    area: '42 hectares',
    staff: 25,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '15 ha', varieties: 9, plantingSeason: 'November-December' },
      { name: 'Dates', nameAr: 'التمور', area: '18 ha', varieties: 12, plantingSeason: 'Year-round' },
      { name: 'Fodder', nameAr: 'الأعلاف', area: '9 ha', varieties: 6, plantingSeason: 'Winter' }
    ],
    activities: [
      { type: 'breeding', description: 'Desert-adapted crop breeding', descriptionAr: 'تربية المحاصيل المتكيفة مع الصحراء' },
      { type: 'research', description: 'Water-efficient irrigation systems', descriptionAr: 'أنظمة الري الموفرة للمياه' },
      { type: 'distribution', description: 'Date palm seedling distribution', descriptionAr: 'توزيع شتلات النخيل' }
    ],
    seedExchange: {
      distributed: 11000,
      received: 2500,
      partners: ['ICARDA', 'Date Palm Research Center', 'Riyadh Center']
    },
    tracking: {
      accessionsStored: 167,
      germplasmTypes: ['Wheat', 'Date palms', 'Fodder crops', 'Desert plants'],
      storageCapacity: '5500 accessions'
    },
    contact: {
      phone: '+966-17-5234567',
      email: 'najran.center@mewa.gov.sa',
      address: 'King Abdulaziz Road, Najran 66262',
      addressAr: 'طريق الملك عبدالعزيز، نجران 66262'
    }
  },

  // Riyadh Region
  {
    id: 'riyadh-001',
    name: 'Riyadh National Seed Bank',
    nameAr: 'بنك البذور الوطني بالرياض',
    region: 'Riyadh',
    city: 'Riyadh',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    established: '2005',
    area: '75 hectares',
    staff: 45,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '25 ha', varieties: 20, plantingSeason: 'November-January' },
      { name: 'Barley', nameAr: 'الشعير', area: '20 ha', varieties: 15, plantingSeason: 'October-November' },
      { name: 'Vegetables', nameAr: 'الخضروات', area: '18 ha', varieties: 35, plantingSeason: 'Year-round' }
    ],
    activities: [
      { type: 'conservation', description: 'National germplasm conservation program', descriptionAr: 'برنامج الحفاظ على الموارد الوراثية الوطنية' },
      { type: 'research', description: 'Advanced genomics and breeding research', descriptionAr: 'أبحاث الجينوم والتربية المتقدمة' },
      { type: 'distribution', description: 'Central seed distribution hub', descriptionAr: 'مركز التوزيع المركزي للبذور' }
    ],
    seedExchange: {
      distributed: 35000,
      received: 12000,
      partners: ['ICARDA', 'CIMMYT', 'All regional centers', 'International gene banks']
    },
    tracking: {
      accessionsStored: 456,
      germplasmTypes: ['All major crops', 'Wild relatives', 'Landraces', 'Modern varieties'],
      storageCapacity: '15000 accessions'
    },
    contact: {
      phone: '+966-11-4012345',
      email: 'riyadh.seedbank@mewa.gov.sa',
      address: 'Diplomatic Quarter, Riyadh 11564',
      addressAr: 'الحي الدبلوماسي، الرياض 11564'
    }
  },
  {
    id: 'riyadh-002',
    name: 'Dirab Research and Experimental Station',
    nameAr: 'محطة الدراب للأبحاث والتجارب',
    region: 'Riyadh',
    city: 'Dirab',
    coordinates: { lat: 24.4239, lng: 46.5951 },
    established: '1985',
    area: '120 hectares',
    staff: 52,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '40 ha', varieties: 25, plantingSeason: 'November-December' },
      { name: 'Dates', nameAr: 'التمور', area: '35 ha', varieties: 18, plantingSeason: 'Year-round' },
      { name: 'Fodder', nameAr: 'الأعلاف', area: '30 ha', varieties: 12, plantingSeason: 'Winter-Spring' }
    ],
    activities: [
      { type: 'breeding', description: 'Central breeding program for major crops', descriptionAr: 'برنامج التربية المركزي للمحاصيل الرئيسية' },
      { type: 'research', description: 'Field trials and variety testing', descriptionAr: 'التجارب الحقلية واختبار الأصناف' },
      { type: 'training', description: 'National agricultural training center', descriptionAr: 'مركز التدريب الزراعي الوطني' }
    ],
    seedExchange: {
      distributed: 28000,
      received: 8500,
      partners: ['All Saudi centers', 'ICARDA', 'FAO', 'Regional cooperatives']
    },
    tracking: {
      accessionsStored: 389,
      germplasmTypes: ['Cereals', 'Date palms', 'Fodder', 'Vegetables'],
      storageCapacity: '12000 accessions'
    },
    contact: {
      phone: '+966-11-5678901',
      email: 'dirab.station@mewa.gov.sa',
      address: 'Dirab, Riyadh 11991',
      addressAr: 'الدراب، الرياض 11991'
    }
  },

  // Qaseem Region
  {
    id: 'qaseem-001',
    name: 'Buraidah Agricultural Development Center',
    nameAr: 'مركز بريدة للتنمية الزراعية',
    region: 'Qaseem',
    city: 'Buraidah',
    coordinates: { lat: 26.3260, lng: 43.9750 },
    established: '2007',
    area: '55 hectares',
    staff: 30,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '22 ha', varieties: 14, plantingSeason: 'November-December' },
      { name: 'Dates', nameAr: 'التمور', area: '20 ha', varieties: 16, plantingSeason: 'Year-round' },
      { name: 'Vegetables', nameAr: 'الخضروات', area: '13 ha', varieties: 20, plantingSeason: 'Year-round' }
    ],
    activities: [
      { type: 'breeding', description: 'Central region crop improvement', descriptionAr: 'تحسين محاصيل المنطقة الوسطى' },
      { type: 'distribution', description: 'Certified seed multiplication', descriptionAr: 'إكثار البذور المعتمدة' },
      { type: 'training', description: 'Modern farming techniques training', descriptionAr: 'تدريب على تقنيات الزراعة الحديثة' }
    ],
    seedExchange: {
      distributed: 16500,
      received: 4200,
      partners: ['Riyadh Center', 'Hail Center', 'Local farmers associations']
    },
    tracking: {
      accessionsStored: 198,
      germplasmTypes: ['Wheat', 'Date palms', 'Vegetables', 'Fodder'],
      storageCapacity: '7000 accessions'
    },
    contact: {
      phone: '+966-16-3234567',
      email: 'buraidah.center@mewa.gov.sa',
      address: 'King Fahd Road, Buraidah 51452',
      addressAr: 'طريق الملك فهد، بريدة 51452'
    }
  },

  // Hail Region
  {
    id: 'hail-001',
    name: 'Hail Northern Agriculture Center',
    nameAr: 'مركز حائل للزراعة الشمالية',
    region: 'Hail',
    city: 'Hail',
    coordinates: { lat: 27.5219, lng: 41.6901 },
    established: '2010',
    area: '48 hectares',
    staff: 24,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '20 ha', varieties: 11, plantingSeason: 'November-December' },
      { name: 'Barley', nameAr: 'الشعير', area: '18 ha', varieties: 9, plantingSeason: 'October-November' },
      { name: 'Olives', nameAr: 'الزيتون', area: '10 ha', varieties: 7, plantingSeason: 'Spring' }
    ],
    activities: [
      { type: 'breeding', description: 'Cold-tolerant variety development', descriptionAr: 'تطوير أصناف مقاومة للبرد' },
      { type: 'research', description: 'Northern region climate adaptation', descriptionAr: 'التكيف المناخي للمنطقة الشمالية' },
      { type: 'conservation', description: 'Traditional crop preservation', descriptionAr: 'الحفاظ على المحاصيل التقليدية' }
    ],
    seedExchange: {
      distributed: 13000,
      received: 3500,
      partners: ['Qaseem Center', 'Tabuk Center', 'Northern farmers']
    },
    tracking: {
      accessionsStored: 176,
      germplasmTypes: ['Wheat', 'Barley', 'Olives', 'Cold-adapted crops'],
      storageCapacity: '6000 accessions'
    },
    contact: {
      phone: '+966-16-5234567',
      email: 'hail.center@mewa.gov.sa',
      address: 'Agricultural Road, Hail 55425',
      addressAr: 'الطريق الزراعي، حائل 55425'
    }
  },

  // Jazan Region
  {
    id: 'jazan-001',
    name: 'Jazan Coffee Research Center',
    nameAr: 'مركز أبحاث البن بجازان',
    region: 'Jazan',
    city: 'Jazan',
    coordinates: { lat: 16.8892, lng: 42.5511 },
    established: '2006',
    area: '52 hectares',
    staff: 32,
    crops: [
      { name: 'Coffee', nameAr: 'البن', area: '30 ha', varieties: 22, plantingSeason: 'Year-round' },
      { name: 'Tropical Fruits', nameAr: 'الفواكه الاستوائية', area: '15 ha', varieties: 18, plantingSeason: 'Year-round' },
      { name: 'Spices', nameAr: 'التوابل', area: '7 ha', varieties: 10, plantingSeason: 'Monsoon season' }
    ],
    activities: [
      { type: 'breeding', description: 'Saudi coffee quality improvement', descriptionAr: 'تحسين جودة البن السعودي' },
      { type: 'research', description: 'Tropical agriculture research', descriptionAr: 'أبحاث الزراعة الاستوائية' },
      { type: 'conservation', description: 'Indigenous coffee variety preservation', descriptionAr: 'الحفاظ على أصناف البن المحلية' }
    ],
    seedExchange: {
      distributed: 14500,
      received: 6200,
      partners: ['Aseer Center', 'Al-Baha Center', 'International Coffee Organization']
    },
    tracking: {
      accessionsStored: 245,
      germplasmTypes: ['Coffee varieties', 'Tropical fruits', 'Spices', 'Native plants'],
      storageCapacity: '8500 accessions'
    },
    contact: {
      phone: '+966-17-3234567',
      email: 'jazan.coffee@mewa.gov.sa',
      address: 'Coastal Road, Jazan 82723',
      addressAr: 'الطريق الساحلي، جازان 82723'
    }
  },
  {
    id: 'jazan-002',
    name: 'Sabya Tropical Agriculture Station',
    nameAr: 'محطة صبيا للزراعة الاستوائية',
    region: 'Jazan',
    city: 'Sabya',
    coordinates: { lat: 17.1495, lng: 42.6252 },
    established: '2013',
    area: '35 hectares',
    staff: 20,
    crops: [
      { name: 'Coffee', nameAr: 'البن', area: '18 ha', varieties: 15, plantingSeason: 'Year-round' },
      { name: 'Mango', nameAr: 'المانجو', area: '10 ha', varieties: 8, plantingSeason: 'Spring' },
      { name: 'Papaya', nameAr: 'البابايا', area: '7 ha', varieties: 5, plantingSeason: 'Year-round' }
    ],
    activities: [
      { type: 'distribution', description: 'Coffee seedling production', descriptionAr: 'إنتاج شتلات البن' },
      { type: 'training', description: 'Coffee cultivation training for farmers', descriptionAr: 'تدريب المزارعين على زراعة البن' },
      { type: 'research', description: 'Post-harvest processing techniques', descriptionAr: 'تقنيات المعالجة بعد الحصاد' }
    ],
    seedExchange: {
      distributed: 9800,
      received: 2100,
      partners: ['Jazan Coffee Center', 'Local cooperatives', 'Yemen coffee farmers']
    },
    tracking: {
      accessionsStored: 132,
      germplasmTypes: ['Coffee', 'Tropical fruits', 'Vegetables'],
      storageCapacity: '4000 accessions'
    },
    contact: {
      phone: '+966-17-3345678',
      email: 'sabya.station@mewa.gov.sa',
      address: 'Sabya, Jazan 82764',
      addressAr: 'صبيا، جازان 82764'
    }
  },

  // Tabuk Region
  {
    id: 'tabuk-001',
    name: 'Tabuk Northwestern Agriculture Center',
    nameAr: 'مركز تبوك للزراعة الشمالية الغربية',
    region: 'Tabuk',
    city: 'Tabuk',
    coordinates: { lat: 28.3838, lng: 36.5550 },
    established: '2009',
    area: '50 hectares',
    staff: 27,
    crops: [
      { name: 'Wheat', nameAr: 'القمح', area: '22 ha', varieties: 13, plantingSeason: 'November-December' },
      { name: 'Fruits', nameAr: 'الفواكه', area: '18 ha', varieties: 16, plantingSeason: 'Spring' },
      { name: 'Vegetables', nameAr: 'الخضروات', area: '10 ha', varieties: 22, plantingSeason: 'Year-round' }
    ],
    activities: [
      { type: 'breeding', description: 'Northwestern region crop adaptation', descriptionAr: 'تكييف محاصيل المنطقة الشمالية الغربية' },
      { type: 'research', description: 'Protected agriculture research', descriptionAr: 'أبحاث الزراعة المحمية' },
      { type: 'distribution', description: 'Greenhouse vegetable seedlings', descriptionAr: 'شتلات الخضروات المحمية' }
    ],
    seedExchange: {
      distributed: 12000,
      received: 3800,
      partners: ['Hail Center', 'Jordan Agricultural Research', 'Local farmers']
    },
    tracking: {
      accessionsStored: 187,
      germplasmTypes: ['Wheat', 'Fruits', 'Vegetables', 'Protected crops'],
      storageCapacity: '6500 accessions'
    },
    contact: {
      phone: '+966-14-4234567',
      email: 'tabuk.center@mewa.gov.sa',
      address: 'Prince Fahd Bin Sultan Road, Tabuk 71491',
      addressAr: 'طريق الأمير فهد بن سلطان، تبوك 71491'
    }
  }
];

// Helper functions
export function getCentersByRegion(region: string): SeedCenter[] {
  return seedCenters.filter(center => center.region === region);
}

export function getCenterById(id: string): SeedCenter | undefined {
  return seedCenters.find(center => center.id === id);
}

export function getAllRegions(): string[] {
  return Array.from(new Set(seedCenters.map(center => center.region)));
}

export function getCentersByCrop(cropName: string): SeedCenter[] {
  return seedCenters.filter(center => 
    center.crops.some(crop => 
      crop.name.toLowerCase().includes(cropName.toLowerCase())
    )
  );
}
