# Saudi Seed Bank — AI-friendly JSON dataset

Snapshot of the cold-storage seed bank workbook **غرف التبريد1 سعد+5-2024.xlsx** (May 2024), restructured into clean JSON for downstream use by AI tools, search/RAG indexes, and analytics.

## Files

| File | What it is |
|---|---|
| `seedbank.json` | Single JSON document with metadata + an `accessions` array of 3,341 records. |
| `seedbank.ndjson` | Same 3,341 records, one JSON object per line. Best for streaming / RAG ingestion / `jq` / vector-DB loaders. |
| `seedbank.schema.json` | JSON Schema (Draft 2020-12) describing every field. |
| `vocab.json` | Frequency lists of categories, sources, regions, families — useful as controlled vocabularies. |
| `convert.py` | The cleaning pipeline that produced everything above. Re-run anytime the workbook is updated. |

## Dataset at a glance

- **3,341 accessions** (one per `SAG` ID, range 1 – 3341, all unique).
- **Collection dates**: 2007-06-19 → 2024-11-19.
- **Categories** (النوع): field crops 2,200 · vegetables 408 · horticultural 350 · wild 301 · medicinal 82.
- **Top families**: Poaceae 1,870 · Fabaceae 306 · Cucurbitaceae 115 · Rubiaceae 92 · Amaranthaceae 89.
- **Germination tests recorded**: 773 accessions (some with up to 6 sequential tests).
- **Flagged as international-trial accessions**: 1,525 (CIMMYT, ICARDA, ICRISAT, ACSAD breeding-nursery imports).
- **Flagged as backup-copy label rows**: 259 (Region cell held `نسخة 20XX/20XX` instead of a real region).

## Record shape (excerpt)

```json
{
  "sag": 6,
  "cold_room_code": 1,
  "names": { "local_ar": "قمح الهلبا", "common_ar": "قمح الخبز", "common_en": "Bread wheat" },
  "taxonomy": { "family": "Poaceae", "genus": "Triticum", "species": "aestivum",
                "scientific_name": ".Triticum aestivum L" },
  "category": { "ar": "حقلي", "en": "field_crop" },
  "collection": { "date_iso": "2010-12-11", "source": "Market",
                  "region": "Al-Qaseem", "place": "Buraidah", "donor": null },
  "weight_g": 279.0,
  "germination_tests": [
    { "test_number": 1, "germination_pct": 10.0,
      "test_date": { "iso": "2018-01-30", "original": "13-5-1439", "system": "hijri" } },
    { "test_number": 5, "germination_pct": 48.0,
      "test_date": { "iso": "2019-04-14", "original": "43569", "system": "excel_serial" } }
  ],
  "flags": { "is_international_trial": false,
             "is_backup_copy_label": false,
             "has_germination_data": true },
  "raw": { "...": "every original cell value, preserved" }
}
```

## What the cleaning did

1. **Dittos resolved.** 386 rows used `"`, `.`, `-` as “same as above” marks in Source/Region/Place/Donor/Date — these were forward-filled from the prior row.
2. **Categories translated.** حقلي→`field_crop`, خضر→`vegetable`, بستانية→`horticultural`, بري→`wild`, طبي→`medicinal`. Original Arabic kept under `category.ar`.
3. **Germination dates normalized to ISO.** Same column held three formats; each is now `{iso, original, system}`:
   - **`hijri`** — 493 cells (e.g. `13-5-1439` → `2018-01-30`).
   - **`excel_serial`** — 605 cells (e.g. `43569` → `2019-04-14`).
   - **`gregorian`** — 19 cells (already proper datetimes).
   - **`year_only`** — 111 cells where someone typed just `2019` (defaulted to Jan 1).
   - **`unparsed`** — 5 cells with typos (`24-1438`, `غير موجودة`, etc.) — `iso` is null.
4. **International-trial flag.** Anything tied to CIMMYT / ICARDA / ICRISAT / ACSAD or a nursery code (`IBWSN`, `IDSN`, `IDYN`, `STEMRRSN`, `ESWYT`, `HTWYT`, `SAWYT`) is marked `is_international_trial: true`. These are not Saudi field collections — useful to filter when you want regional analysis.
5. **Backup-copy flag.** When the Region cell was actually `نسخة 2022/2023` etc., set `is_backup_copy_label: true` so you can exclude or treat separately.
6. **Originals preserved.** Every record has a `raw` sub-object with the unmodified cell values, so the cleaning is fully auditable and reversible.

## Example queries

```python
import json
data = json.load(open('seedbank.json', encoding='utf-8'))
recs = data['accessions']

# Saudi-only bread wheat with at least one passing germination test
saudi = [r for r in recs
         if r['taxonomy']['scientific_name'] and 'Triticum aestivum' in r['taxonomy']['scientific_name']
         and not r['flags']['is_international_trial']
         and any((t['germination_pct'] or 0) >= 80 for t in r['germination_tests'])]

# Latest germination % per accession
def latest(r):
    tests = sorted([t for t in r['germination_tests'] if t['test_date'] and t['test_date']['iso']],
                   key=lambda t: t['test_date']['iso'])
    return tests[-1]['germination_pct'] if tests else None
```

```bash
# NDJSON + jq — average weight per category
jq -s 'group_by(.category.en) | map({cat: .[0].category.en, avg_weight: (map(.weight_g // 0) | add/length), n: length})' seedbank.ndjson
```

---

# بنك البذور السعودي — مجموعة بيانات بصيغة JSON ملائمة للذكاء الاصطناعي

نسخة منظمة من ملف **غرف التبريد1 سعد+5-2024.xlsx** (مايو 2024)، تم إعادة هيكلتها في صيغة JSON نظيفة لاستخدامها مع أدوات الذكاء الاصطناعي والبحث والتحليل.

## الملفات

| الملف | الوصف |
|---|---|
| `seedbank.json` | ملف JSON واحد يحتوي على بيانات وصفية ومصفوفة `accessions` تضم 3,341 سجلًا. |
| `seedbank.ndjson` | نفس السجلات، سجل JSON واحد لكل سطر — مناسب للتدفق والتحميل في قواعد المتجهات. |
| `seedbank.schema.json` | مخطط JSON Schema يصف كل حقل. |
| `vocab.json` | قوائم تكرار للفئات والمصادر والمناطق والعائلات النباتية. |
| `convert.py` | البرنامج النصي الذي ينتج الملفات أعلاه — أعد تشغيله عند تحديث ملف Excel. |

## نظرة عامة

- **3,341 مدخل** (لكل واحد رقم `SAG` فريد بين 1 و 3341).
- **تواريخ الجمع**: من 2007-06-19 إلى 2024-11-19.
- **الفئات**: حقلي 2,200 · خضر 408 · بستانية 350 · بري 301 · طبي 82.
- **العائلات الأكثر**: Poaceae 1,870 · Fabaceae 306 · Cucurbitaceae 115.
- **مدخلات بها اختبارات إنبات**: 773 (بعضها يحوي ست اختبارات متتابعة).
- **مدخلات مصدرها تجارب دولية**: 1,525 (CIMMYT, ICARDA, ICRISAT, ACSAD).
- **مدخلات تحمل وسم نسخة احتياطية**: 259 (`نسخة 20XX/20XX`).

## ما الذي تم تنظيفه

1. **علامات التكرار** (`"` و `.` و `-`) في أعمدة المصدر والمنطقة والمكان وتاريخ الجمع تم تعبئتها من الصف السابق.
2. **الفئات** (`النوع`) تُرجمت إلى رموز إنجليزية مع الإبقاء على النص العربي الأصلي.
3. **تواريخ الإنبات** الموحدة إلى ISO 8601:
   - **هجري** (493): مثل `13-5-1439` → `2018-01-30`.
   - **أرقام تسلسلية من Excel** (605): مثل `43569` → `2019-04-14`.
   - **سنة فقط** (111): مثل `2019` → `2019-01-01`.
   - **ميلادي** (19) محفوظ كما هو.
   - **غير قابل للقراءة** (5) — حُفظ النص الأصلي و iso = null.
4. **علم التجارب الدولية**: كل ما ارتبط بـ CIMMYT/ICARDA/ICRISAT/ACSAD أو رموز المشاتل الدولية (IBWSN, IDSN, ESWYT, HTWYT…) موسوم بـ `is_international_trial: true`.
5. **علم النسخ الاحتياطية**: عندما تكون قيمة المنطقة `نسخة 2022/2023` يُرفع `is_backup_copy_label`.
6. **الحفاظ على الأصل**: كل سجل يحوي كائن `raw` يضم القيم الأصلية للخلايا قبل أي تنظيف.

## الحقول الرئيسية

- `sag` — الرقم التعريفي للمدخل في البنك الوراثي السعودي.
- `cold_room_code` — رمز غرفة التبريد (1–8).
- `names.local_ar` / `common_ar` / `common_en` — أسماء المحلية والشائعة.
- `taxonomy.family/genus/species/scientific_name` — التصنيف النباتي.
- `category.ar` / `category.en` — الفئة بالعربية والترجمة.
- `collection.date_iso/source/region/place/donor` — معلومات الجمع.
- `weight_g` — الوزن بالجرام.
- `germination_tests[]` — قائمة اختبارات الإنبات (نسبة + تاريخ مع نظامه الأصلي).
- `flags` — أعلام `is_international_trial` / `is_backup_copy_label` / `has_germination_data`.
- `raw` — القيم الأصلية للخلايا.
