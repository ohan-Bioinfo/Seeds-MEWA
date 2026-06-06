import { useMemo, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import ExportButton from '@/components/ExportButton';
import { generateStandaloneHTML } from '@/lib/htmlExport';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  inventoryData,
  distributionRequests,
  calculateCenterSummaries,
  getCriticalStockItems,
  getPendingDistributions,
  SEEDBANK_TOTALS,
  CATEGORY_BREAKDOWN,
  SOURCE_BREAKDOWN,
  FAMILY_BREAKDOWN,
  type InventoryItem,
  type DistributionRequest
} from '@/data/inventoryData';
import {
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Truck,
  Activity,
  Database,
  Sprout,
  BarChart3,
  Clock
} from 'lucide-react';

// Overview bar chart — accessions per cold room (static, not filtered)
const COLD_ROOM_BAR_DATA = [
  { room: 'غ١', label: 'غرفة التبريد الأولى', accessions: 2179, fill: '#0B5F3A' },
  { room: 'غ٢', label: 'غرفة التبريد الثانية', accessions: 451,  fill: '#D97706' },
  { room: 'غ٨', label: 'غرفة التبريد الثامنة', accessions: 325,  fill: '#6B4423' },
  { room: 'غ٧', label: 'غرفة التبريد السابعة', accessions: 212,  fill: '#7c3aed' },
  { room: 'غ٥', label: 'غرفة التبريد الخامسة', accessions: 109,  fill: '#dc2626' },
  { room: 'غ٤', label: 'غرفة التبريد الرابعة', accessions: 50,   fill: '#ef4444' },
  { room: 'غ٦', label: 'غرفة التبريد السادسة', accessions: 8,    fill: '#9ca3af' },
  { room: 'غ٣', label: 'غرفة التبريد الثالثة', accessions: 7,    fill: '#9ca3af' },
];

/**
 * Design Philosophy: Data-Driven Cartography with Agricultural Heritage
 * - Clean data visualization with earth tones
 * - Status indicators using traffic light colors
 * - Hexagonal cards for metrics
 * - Real-time monitoring aesthetic
 */

export default function InventoryTracking() {
  const { t, language } = useLanguage();
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  
  const centerSummaries = useMemo(() => calculateCenterSummaries(), []);
  const criticalItems = useMemo(() => getCriticalStockItems(), []);
  const pendingDist = useMemo(() => getPendingDistributions(), []);
  
  // Filter inventory data
  const filteredInventory = useMemo(() => {
    return inventoryData.filter(item => {
      const centerMatch = selectedCenter === 'all' || item.centerId === selectedCenter;
      const cropMatch = selectedCrop === 'all' || item.cropType === selectedCrop;
      return centerMatch && cropMatch;
    });
  }, [selectedCenter, selectedCrop]);
  
  // Calculate overall statistics
  const totalStock = filteredInventory.reduce((sum, item) => sum + item.stockLevel, 0);
  const totalCapacity = filteredInventory.reduce((sum, item) => sum + item.maxCapacity, 0);
  const avgGermination = Math.round(
    filteredInventory.reduce((sum, item) => sum + item.germinationRate, 0) / filteredInventory.length
  );
  const lowStockCount = filteredInventory.filter(item => item.status === 'low' || item.status === 'critical').length;
  
  // Get unique centers and crops for filters
  const uniqueCenters = Array.from(new Set(inventoryData.map(item => ({
    id: item.centerId,
    name: item.centerName
  }))));
  
  const uniqueCrops = Array.from(new Set(inventoryData.map(item => item.cropType)));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-300';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'overstocked': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };
  
  const getDistributionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  const generateInventoryHTML = () => {
    const statsHTML = `
      <div class="grid">
        <div class="stat-card">
          <div class="stat-label">${language === 'ar' ? 'المخزون الحالي' : 'Current Stock'}</div>
          <div class="stat-value">${totalStock.toLocaleString()} ${language === 'ar' ? 'كجم' : 'kg'}</div>
          <div class="progress-bar"><div class="progress-fill" style="width: ${(totalStock / totalCapacity) * 100}%"></div></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${language === 'ar' ? 'معدل الإنبات' : 'Germination Rate'}</div>
          <div class="stat-value">${avgGermination}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${language === 'ar' ? 'عناصر منخفضة المخزون' : 'Low Stock Items'}</div>
          <div class="stat-value">${lowStockCount}</div>
        </div>
      </div>
    `;
    
    const inventoryTableHTML = `
      <div class="card">
        <h2>${language === 'ar' ? 'تفاصيل المخزون' : 'Inventory Details'}</h2>
        <table>
          <thead>
            <tr>
              <th>${language === 'ar' ? 'المحصول' : 'Crop'}</th>
              <th>${language === 'ar' ? 'المركز' : 'Center'}</th>
              <th>${language === 'ar' ? 'المخزون' : 'Stock'}</th>
              <th>${language === 'ar' ? 'الإنبات' : 'Germination'}</th>
              <th>${language === 'ar' ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            ${filteredInventory.map(item => `
              <tr>
                <td><strong>${item.variety}</strong><br/><small>${item.cropType}</small></td>
                <td>${item.centerName}</td>
                <td>${item.stockLevel} / ${item.maxCapacity} kg</td>
                <td>${item.germinationRate}%</td>
                <td><span class="badge badge-${item.status === 'optimal' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}">${item.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    return statsHTML + inventoryTableHTML;
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap items-center gap-4">
                <Database className="w-8 h-8 sm:w-12 sm:h-12" />
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold font-serif">
                    {language === 'ar' ? 'بنك البذور' : 'Seed Bank'}
                  </h1>
                  <p className="text-green-100 mt-2">
                    {language === 'ar' 
                      ? '3,341 مقتنى في 8 غرف تبريد — بنك البذور الوطني، الرياض'
                      : '3,341 accessions across 8 cold rooms — National Seed Bank, Riyadh'}
                  </p>
                </div>
              </div>
              <ExportButton 
                variant="outline" 
                onExport={() => {
                  const content = generateInventoryHTML();
                  return {
                    html: generateStandaloneHTML({
                      title: language === 'ar' ? 'تقرير المخزون' : 'Inventory Report',
                      content,
                      language
                    }),
                    filename: `seedbank-report-${new Date().toISOString().split('T')[0]}.html`,
                    title: language === 'ar' ? 'تقرير بنك البذور' : 'Seed Bank Report'
                  };
                }}
              />
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="stat-card p-6 border-2 border-green-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {language === 'ar' ? 'إجمالي' : 'Total'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-900">
                {totalStock.toLocaleString()}
                <span className="text-sm font-normal text-gray-600 mr-2">
                  {language === 'ar' ? 'كجم' : 'kg'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'ar' ? 'المخزون الحالي' : 'Current Stock'}
              </p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all"
                  style={{ width: `${(totalStock / totalCapacity) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((totalStock / totalCapacity) * 100)}% {language === 'ar' ? 'من السعة' : 'of capacity'}
              </p>
            </Card>

            <Card className="stat-card p-6 border-2 border-amber-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <Sprout className="w-8 h-8 text-amber-600" />
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {language === 'ar' ? 'متوسط' : 'Average'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-amber-900">
                {avgGermination}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'ar' ? 'معدل الإنبات' : 'Germination Rate'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {avgGermination >= 85 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs text-gray-600">
                  {language === 'ar' ? 'عبر جميع الأصناف' : 'Across all varieties'}
                </span>
              </div>
            </Card>

            <Card className="stat-card p-6 border-2 border-red-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {language === 'ar' ? 'تنبيه' : 'Alert'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-red-900">
                {lowStockCount}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'ar' ? 'عناصر منخفضة المخزون' : 'Low Stock Items'}
              </p>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => {
                    const element = document.getElementById('critical-items');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </div>
            </Card>

            <Card className="stat-card p-6 border-2 border-blue-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {pendingDist.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'ar' ? 'طلبات التوزيع' : 'Distribution Requests'}
              </p>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                  onClick={() => {
                    const element = document.getElementById('distributions');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {language === 'ar' ? 'إدارة الطلبات' : 'Manage Requests'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8 bg-white border-2 border-green-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المركز' : 'Center'}
                </label>
                <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع المراكز' : 'All Centers'}
                    </SelectItem>
                    {uniqueCenters.map(center => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المحصول' : 'Crop Type'}
                </label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع المحاصيل' : 'All Crops'}
                    </SelectItem>
                    {uniqueCrops.map(crop => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCenter('all');
                    setSelectedCrop('all');
                  }}
                  className="w-full md:w-auto"
                >
                  {language === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs for different views */}
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-green-100">
              <TabsTrigger value="inventory" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{language === 'ar' ? 'المخزون' : 'Inventory'}</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{language === 'ar' ? 'التحليلات' : 'Analytics'}</span>
              </TabsTrigger>
              <TabsTrigger value="distributions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Truck className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{language === 'ar' ? 'التوزيع' : 'Distributions'}</span>
              </TabsTrigger>
              <TabsTrigger value="centers" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Activity className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{language === 'ar' ? 'ملخص المراكز' : 'Centers'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              {/* Critical Items Alert */}
              {criticalItems.length > 0 && (
                <Card id="critical-items" className="p-6 bg-red-50 border-2 border-red-300">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">
                        {language === 'ar' ? 'تنبيه: عناصر بحاجة إلى إعادة تخزين' : 'Alert: Items Need Restocking'}
                      </h3>
                      <p className="text-sm text-red-700 mb-4">
                        {language === 'ar' 
                          ? `${criticalItems.length} عنصر أقل من الحد الأدنى للمخزون`
                          : `${criticalItems.length} items below minimum stock threshold`}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {criticalItems.slice(0, 4).map(item => (
                          <div key={item.id} className="bg-white p-3 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{item.variety}</span>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.centerName}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="font-semibold text-red-600">
                                {item.stockLevel} kg
                              </span>
                              <span className="text-gray-500"> / {item.minThreshold} kg min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Overview Bar Chart — accessions per cold room */}
              <Card className="p-6 bg-white border-2 border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'المقتنيات حسب غرفة التبريد' : 'Accessions per Cold Room'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'ar' ? 'إجمالي 3,341 مقتنى — بنك البذور الوطني، الرياض' : 'Total 3,341 accessions — National Seed Bank, Riyadh'}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {language === 'ar' ? '8 غرف' : '8 Rooms'}
                  </Badge>
                </div>
                <div dir="ltr" className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={COLD_ROOM_BAR_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <XAxis dataKey="room" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), language === 'ar' ? 'مقتنى' : 'accessions']}
                        labelFormatter={(label: string, payload) =>
                          payload?.[0]?.payload?.label ?? label
                        }
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                      <Bar dataKey="accessions" radius={[4, 4, 0, 0]}>
                        {COLD_ROOM_BAR_DATA.map((entry) => (
                          <Cell key={entry.room} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Inventory Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInventory.map(item => (
                  <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {item.variety}
                        </h3>
                        <p className="text-sm text-gray-600">{item.centerName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.cropType}
                          </Badge>
                          <Badge className={`${getStatusColor(item.status)} text-xs`}>
                            {getStatusIcon(item.status)}
                            <span className="mr-1">{item.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Stock Level */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'مستوى المخزون' : 'Stock Level'}
                          </span>
                          <span className="text-sm font-semibold">
                            {item.stockLevel} / {item.maxCapacity} kg
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              item.status === 'critical' ? 'bg-red-500' :
                              item.status === 'low' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(item.stockLevel / item.maxCapacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Germination Rate */}
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {language === 'ar' ? 'معدل الإنبات' : 'Germination'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-700">
                          {item.germinationRate}%
                        </span>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">
                            {language === 'ar' ? 'موقع التخزين' : 'Storage Location'}
                          </p>
                          <p className="text-sm font-medium text-gray-900">{item.storageLocation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {language === 'ar' ? 'سنة الحصاد' : 'Harvest Year'}
                          </p>
                          <p className="text-sm font-medium text-gray-900">{item.harvestYear}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {language === 'ar' ? 'آخر اختبار' : 'Last Tested'}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(item.lastTested).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {language === 'ar' ? 'طلبات التوزيع' : 'Dist. Requests'}
                          </p>
                          <p className="text-sm font-medium text-gray-900">{item.distributionRequests}</p>
                        </div>
                      </div>

                      {/* Germination trend sparkline */}
                      {item.germinationHistory.length >= 2 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">
                            {language === 'ar' ? 'اتجاه الإنبات' : 'Germination Trend'}
                          </p>
                          <div dir="ltr" className="w-full h-12">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={item.germinationHistory} margin={{ top: 2, right: 4, left: 4, bottom: 2 }}>
                                <Line
                                  type="monotone"
                                  dataKey="pct"
                                  stroke={item.status === 'optimal' ? '#22c55e' : item.status === 'low' ? '#f59e0b' : '#ef4444'}
                                  strokeWidth={1.5}
                                  dot={{ r: 2, fill: item.status === 'optimal' ? '#22c55e' : item.status === 'low' ? '#f59e0b' : '#ef4444' }}
                                  isAnimationActive={false}
                                />
                                <Tooltip
                                  formatter={(v: number) => [`${v}%`, language === 'ar' ? 'إنبات' : 'germ.']}
                                  labelFormatter={(l: string) => l}
                                  contentStyle={{ fontSize: 11, borderRadius: 6, padding: '2px 8px' }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">

              {/* Summary strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: language === 'ar' ? 'إجمالي المقتنيات' : 'Total Accessions', value: SEEDBANK_TOTALS.total.toLocaleString(), color: 'bg-green-50 border-green-200', text: 'text-green-800' },
                  { label: language === 'ar' ? 'محلية / سعودية' : 'Saudi / Local', value: SEEDBANK_TOTALS.saudiLocal.toLocaleString(), color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' },
                  { label: language === 'ar' ? 'تجارب دولية' : 'International Trials', value: SEEDBANK_TOTALS.internationalTrials.toLocaleString(), color: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
                  { label: language === 'ar' ? 'لها بيانات إنبات' : 'Germination Tested', value: SEEDBANK_TOTALS.withGerminationData.toLocaleString(), color: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
                ].map(s => (
                  <Card key={s.label} className={`p-4 border-2 ${s.color}`}>
                    <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                  </Card>
                ))}
              </div>

              {/* Categories + Origin */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Category breakdown */}
                <Card className="p-6 border-2 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'ar' ? 'توزيع المقتنيات حسب الفئة' : 'Accessions by Category'}
                  </h3>
                  <div className="space-y-3">
                    {CATEGORY_BREAKDOWN.map(cat => (
                      <div key={cat.en}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {language === 'ar' ? cat.ar : cat.en}
                          </span>
                          <span className="text-sm text-gray-500">{cat.count.toLocaleString()} ({cat.pct}%)</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Origin split */}
                <Card className="p-6 border-2 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'ar' ? 'مصدر المقتنيات' : 'Accession Origin'}
                  </h3>
                  <div dir="ltr" className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: language === 'ar' ? 'محلي / سعودي' : 'Saudi / Local', value: SEEDBANK_TOTALS.saudiLocal, fill: '#0B5F3A' },
                            { name: language === 'ar' ? 'تجارب دولية' : 'International Trials', value: SEEDBANK_TOTALS.internationalTrials, fill: '#2563EB' },
                            { name: language === 'ar' ? 'نسخ احتياطية' : 'Backup Copies', value: SEEDBANK_TOTALS.backupCopies, fill: '#9ca3af' },
                          ]}
                          cx="50%" cy="50%" outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          labelLine={false}
                        />
                        <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Sources + Families */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top sources */}
                <Card className="p-6 border-2 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'ar' ? 'أبرز مصادر الجمع' : 'Top Collection Sources'}
                  </h3>
                  <div dir="ltr" className="w-full" style={{ height: 208 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SOURCE_BREAKDOWN} layout="vertical" margin={{ left: 4, right: 12, top: 4, bottom: 4 }}>
                        <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                        <Tooltip formatter={(v: number) => [v.toLocaleString(), language === 'ar' ? 'مقتنى' : 'accessions']} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {SOURCE_BREAKDOWN.map(s => (
                            <Cell key={s.name} fill={s.type === 'international' ? '#2563EB' : s.type === 'local' ? '#0B5F3A' : '#9ca3af'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-800 inline-block" />{language === 'ar' ? 'محلي' : 'Local'}</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />{language === 'ar' ? 'دولي' : 'International'}</span>
                  </div>
                </Card>

                {/* Top plant families */}
                <Card className="p-6 border-2 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'ar' ? 'أبرز العائلات النباتية' : 'Top Plant Families'}
                  </h3>
                  <div dir="ltr" className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={FAMILY_BREAKDOWN} layout="vertical" margin={{ left: 100, right: 20, top: 4, bottom: 4 }}>
                        <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="family" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={95} />
                        <Tooltip
                          formatter={(v: number) => [v.toLocaleString(), language === 'ar' ? 'مقتنى' : 'accessions']}
                          labelFormatter={(l: string, p) => `${l} — ${p?.[0]?.payload?.note ?? ''}`}
                        />
                        <Bar dataKey="count" fill="#0B5F3A" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Viability + Collection range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 border-2 border-green-100 md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    {language === 'ar' ? 'حيوية البذور (من 773 مقتنى مختبر)' : 'Seed Viability (from 773 tested)'}
                  </h3>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-700 font-medium">{language === 'ar' ? 'عالية ≥80%' : 'High ≥80%'}</span>
                        <span className="text-green-700">{SEEDBANK_TOTALS.highViability}</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(SEEDBANK_TOTALS.highViability / SEEDBANK_TOTALS.withGerminationData) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-700">{Math.round(SEEDBANK_TOTALS.highViability / SEEDBANK_TOTALS.withGerminationData * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-700 font-medium">{language === 'ar' ? 'منخفضة <80%' : 'Low <80%'}</span>
                        <span className="text-red-700">{SEEDBANK_TOTALS.lowViability}</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${(SEEDBANK_TOTALS.lowViability / SEEDBANK_TOTALS.withGerminationData) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-700">{Math.round(SEEDBANK_TOTALS.lowViability / SEEDBANK_TOTALS.withGerminationData * 100)}%</span>
                  </div>
                </Card>

                <Card className="p-5 border-2 border-green-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                      {language === 'ar' ? 'فترة الجمع' : 'Collection Period'}
                    </h3>
                    <div className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'بداية' : 'Start'}</div>
                    <div className="text-base font-semibold text-green-800 mb-3">{SEEDBANK_TOTALS.collectionStart}</div>
                    <div className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'آخر تحديث' : 'Latest'}</div>
                    <div className="text-base font-semibold text-green-800">{SEEDBANK_TOTALS.collectionEnd}</div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                    {language === 'ar'
                      ? `متوسط وزن العينة: ${SEEDBANK_TOTALS.avgWeightG}غ`
                      : `Avg. sample weight: ${SEEDBANK_TOTALS.avgWeightG}g`}
                  </div>
                </Card>
              </div>

            </TabsContent>

            {/* Distributions Tab */}
            <TabsContent value="distributions" id="distributions" className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {distributionRequests.map(request => (
                  <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow border-2 border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getDistributionStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-700">
                              {language === 'ar' ? 'من:' : 'From:'}
                            </span>
                            <span className="text-gray-900">{request.fromCenter}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-700">
                              {language === 'ar' ? 'إلى:' : 'To:'}
                            </span>
                            <span className="text-gray-900">{request.toCenter}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-700">
                              {language === 'ar' ? 'المحصول:' : 'Crop:'}
                            </span>
                            <span className="text-gray-900">{request.variety}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-700">
                            {request.quantity} kg
                          </div>
                          {request.estimatedDelivery && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {language === 'ar' ? 'التسليم المتوقع:' : 'Est. Delivery:'}
                              </span>
                              <span className="font-medium">
                                {new Date(request.estimatedDelivery).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {language === 'ar' ? 'تاريخ الطلب:' : 'Request Date:'}
                          {' '}
                          {new Date(request.requestDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Center Summary Tab */}
            <TabsContent value="centers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {centerSummaries.map(summary => (
                  <Card key={summary.centerId} className="p-6 border-2 border-green-200">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                      {summary.centerName}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'إجمالي المخزون' : 'Total Stock'}
                        </p>
                        <p className="text-xl font-bold text-green-700">
                          {summary.totalStock.toLocaleString()} kg
                        </p>
                      </div>
                      
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'معدل الإنبات' : 'Avg. Germination'}
                        </p>
                        <p className="text-xl font-bold text-amber-700">
                          {summary.averageGerminationRate}%
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'معدل الاستخدام' : 'Utilization'}
                        </p>
                        <p className="text-xl font-bold text-blue-700">
                          {Math.round(summary.utilizationRate)}%
                        </p>
                      </div>
                      
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'عناصر حرجة' : 'Critical Items'}
                        </p>
                        <p className="text-xl font-bold text-red-700">
                          {summary.criticalItems}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'طلبات التوزيع المعلقة' : 'Pending Distributions'}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {summary.pendingDistributions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'عناصر منخفضة المخزون' : 'Low Stock Items'}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {summary.lowStockItems}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
