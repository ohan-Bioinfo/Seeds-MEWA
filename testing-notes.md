# MEWA Seed Center Dashboard - Testing Notes

## Map View - Working ✅
- Interactive Google Maps showing Saudi Arabia
- 9 region markers visible (Taif, Aseer, Al-Baha, Najran, Riyadh, Qaseem, Hail, Jazan, Tabuk)
- Region stats cards showing:
  - Taif: 15 wheat, 0 coffee
  - Aseer: 10 wheat, 0 coffee  
  - Al-Baha: 15 wheat, 2 coffee ✅ (coffee data now loading!)
  - Najran: 10 wheat, 0 coffee
  - Riyadh: 1 wheat, 0 coffee
  - Qaseem: 1 wheat, 0 coffee
  - Hail: 4 wheat, 0 coffee
  - Jazan: 1 wheat, 0 coffee
  - Tabuk: 3 wheat, 0 coffee

## Data Loading Status
- Wheat data: ✅ Loading correctly (563 accessions)
- Coffee data: ⚠️ Partially loading (only showing 2 in Al-Baha, but should be 80 total)
  - Issue: Most coffee records have lowercase region names like "aseer", "abha" which don't match normalized names
  - Need to improve region name normalization

## Next Steps
1. Fix region name normalization to handle lowercase and variations
2. Test Data Catalog table view
3. Test filtering functionality
4. Create checkpoint and deliver
