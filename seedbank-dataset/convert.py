"""Convert the seed-bank workbook ALL sheet -> AI-friendly JSON + NDJSON.

Cleaning rules:
- Strip whitespace; map placeholders (".", "-", "\"", "''", "") -> None.
- Forward-fill ditto marks (\") in Source / Region / Place / Donor / Date.
- Normalize germination dates: Hijri "DD-MM-YYYY" (when YYYY >= 1300)
  -> Gregorian via hijri-converter; Excel serials -> Gregorian; datetime kept.
- Tag international-trial / nursery accessions (CIMMYT trials, STEMRRSN, ESWYT,
  HTWYT, نسخة backup-copy rows) with a `flags.is_international_trial` bool.
- Each output record carries a `raw` sub-object preserving original cell values
  so nothing is lost.
"""

import json
import math
import re
from datetime import date, datetime, timedelta
from pathlib import Path

import pandas as pd
try:
    from hijridate import Hijri
except ImportError:
    from hijri_converter import Hijri

SRC = Path("/sessions/loving-brave-edison/mnt/uploads/غرف التبريد1  سعد+5-2024.xlsx")
OUT = Path("/sessions/loving-brave-edison/mnt/outputs")

DITTO = {'"', "''", '.', '-', '_', ' ', ''}
TRIAL_PATTERNS = [
    r'\bIBWSN\b', r'\bIDSN\b', r'\bIDYN\b', r'\bSTEMRRSN\b', r'\bESWYT\b',
    r'\bHTWYT\b', r'\bSAWYT\b', r'\bIWWYT\b', r'\bIWWYTI\b',
    r'CIMMYT', r'ICARDA', r'ICRISAT', r'ACSAD',
]
TRIAL_RE = re.compile('|'.join(TRIAL_PATTERNS), re.IGNORECASE)
BACKUP_RE = re.compile(r'نسخة')


def clean(v):
    """Normalize a cell to a clean string, datetime, number, or None."""
    if v is None:
        return None
    if isinstance(v, float) and math.isnan(v):
        return None
    if isinstance(v, str):
        s = v.strip()
        if s in DITTO:
            return None
        return s
    return v


def excel_serial_to_date(n):
    """Excel 1900 serial -> ISO date (handles 1900 leap-year bug)."""
    if n < 60:
        base = date(1899, 12, 31)
        return base + timedelta(days=int(n))
    base = date(1899, 12, 30)
    return base + timedelta(days=int(n))


HIJRI_RE = re.compile(r'^\s*(\d{1,2})\s*[-/]\s*(\d{1,2})\s*[-/]\s*(\d{3,4})\s*$')


def normalize_germ_date(v):
    """Return {iso, original, system} or None."""
    if v is None:
        return None
    if isinstance(v, datetime):
        return {"iso": v.date().isoformat(), "original": v.date().isoformat(), "system": "gregorian"}
    if isinstance(v, date):
        return {"iso": v.isoformat(), "original": v.isoformat(), "system": "gregorian"}
    if isinstance(v, (int, float)):
        try:
            n = int(v)
            # Excel serial range we expect (~ 2010-2025): 40000–50000
            if 20000 <= n <= 60000:
                d = excel_serial_to_date(n)
                return {"iso": d.isoformat(), "original": str(n), "system": "excel_serial"}
            # Bare year (someone wrote just "2019")
            if 2000 <= n <= 2030:
                return {"iso": f"{n}-01-01", "original": str(n), "system": "year_only"}
            # Bare Hijri year
            if 1430 <= n <= 1460:
                try:
                    g = Hijri(n, 1, 1).to_gregorian()
                    return {"iso": g.isoformat(), "original": str(n), "system": "hijri_year_only"}
                except Exception:
                    pass
        except Exception:
            pass
        return {"iso": None, "original": str(v), "system": "unknown_number"}
    if isinstance(v, str):
        s = v.strip()
        if not s:
            return None
        m = HIJRI_RE.match(s)
        if m:
            d_, mth, yr = int(m.group(1)), int(m.group(2)), int(m.group(3))
            # Hijri years in this dataset are ~1430–1446
            if 1300 <= yr <= 1500 and 1 <= mth <= 12 and 1 <= d_ <= 30:
                try:
                    g = Hijri(yr, mth, d_).to_gregorian()
                    return {
                        "iso": g.isoformat(),
                        "original": s,
                        "system": "hijri",
                    }
                except Exception:
                    return {"iso": None, "original": s, "system": "hijri_invalid"}
            # Otherwise probably a Gregorian D-M-Y
            if 1900 <= yr <= 2100 and 1 <= mth <= 12 and 1 <= d_ <= 31:
                try:
                    return {
                        "iso": date(yr, mth, d_).isoformat(),
                        "original": s,
                        "system": "gregorian",
                    }
                except Exception:
                    pass
        return {"iso": None, "original": s, "system": "unparsed"}
    return {"iso": None, "original": str(v), "system": "unknown"}


def is_intl_trial(source, region, place):
    blob = " ".join(str(x) for x in (source, region, place) if x)
    return bool(TRIAL_RE.search(blob))


def is_backup_copy(region):
    if not region:
        return False
    return bool(BACKUP_RE.search(str(region)))


def main():
    df = pd.read_excel(SRC, sheet_name='ALL', header=0)
    df = df.dropna(how='all').copy()

    # Forward-fill ditto-marked columns
    for col in ['Source', 'Region', 'Place of Coll.', 'Doner', 'Date']:
        cleaned = df[col].map(clean)
        df[col + '_clean'] = cleaned.ffill()
        df[col + '_raw'] = df[col]

    records = []
    for _, r in df.iterrows():
        sag = r['SAG']
        if pd.isna(sag):
            continue
        try:
            sag = int(sag)
        except (ValueError, TypeError):
            continue

        coll_date = r['Date_clean']
        if isinstance(coll_date, datetime):
            coll_iso = coll_date.date().isoformat()
        elif isinstance(coll_date, date):
            coll_iso = coll_date.isoformat()
        else:
            coll_iso = None

        # Up to 6 germination tests
        tests = []
        pairs = [
            ('الانبات', 'تاريخ الانبات'),
            ('انبات 2', 'تاريخ الانبات.1'),
            ('انبات 3', 'تاريخ الانبات.2'),
            ('انبات 4', 'تاريخ الانبات.3'),
            ('انبات 5', 'تاريخ الانبات.4'),
            ('انبات 6', 'تاريخ الانبات.5'),
        ]
        for i, (gcol, dcol) in enumerate(pairs, start=1):
            g = clean(r.get(gcol))
            d = normalize_germ_date(clean(r.get(dcol)))
            if g is None and d is None:
                continue
            try:
                gpct = float(g) if g is not None else None
            except (ValueError, TypeError):
                gpct = None
            tests.append({
                "test_number": i,
                "germination_pct": gpct,
                "germination_pct_raw": str(g) if g is not None else None,
                "test_date": d,
            })

        weight = clean(r.get('الوزن بالجرام'))
        try:
            weight_g = float(weight) if weight is not None else None
        except (ValueError, TypeError):
            weight_g = None

        code = clean(r.get('Code'))
        try:
            code_int = int(code) if code is not None else None
        except (ValueError, TypeError):
            code_int = None

        source = clean(r['Source_clean'])
        region = clean(r['Region_clean'])
        place = clean(r['Place of Coll._clean'])
        donor = clean(r['Doner_clean'])
        # Coerce numeric source/region/place/donor to string (some farms used plot numbers)
        if isinstance(source, (int, float)): source = str(int(source) if source == int(source) else source)
        if isinstance(region, (int, float)): region = str(int(region) if region == int(region) else region)
        if isinstance(place, (int, float)): place = str(int(place) if place == int(place) else place)
        if isinstance(donor, (int, float)): donor = str(int(donor) if donor == int(donor) else donor)

        rec = {
            "sag": sag,
            "cold_room_code": code_int,
            "names": {
                "local_ar": clean(r.get('Local Name ')),
                "common_ar": clean(r.get('الإسم بالعربي')),
                "common_en": clean(r.get('English Name')),
            },
            "taxonomy": {
                "family": clean(r.get('Family Name')),
                "genus": clean(r.get('Genus')),
                "species": clean(r.get('.Spp')),
                "scientific_name": clean(r.get('Sc. Name')),
            },
            "category": {
                "ar": clean(r.get('النوع')),
                "en": {
                    'حقلي': 'field_crop',
                    'خضر': 'vegetable',
                    'بستانية': 'horticultural',
                    'بري': 'wild',
                    'طبي': 'medicinal',
                }.get(clean(r.get('النوع'))),
            },
            "collection": {
                "date_iso": coll_iso,
                "source": source,
                "region": region,
                "place": place,
                "donor": donor,
            },
            "weight_g": weight_g,
            "germination_tests": tests,
            "flags": {
                "is_international_trial": is_intl_trial(source, region, place),
                "is_backup_copy_label": is_backup_copy(region),
                "has_germination_data": len(tests) > 0,
            },
            "raw": {
                "Code": _safe(r.get('Code')),
                "Local Name": _safe(r.get('Local Name ')),
                "الإسم بالعربي": _safe(r.get('الإسم بالعربي')),
                "English Name": _safe(r.get('English Name')),
                "Family Name": _safe(r.get('Family Name')),
                "Genus": _safe(r.get('Genus')),
                ".Spp": _safe(r.get('.Spp')),
                "Sc. Name": _safe(r.get('Sc. Name')),
                "Date": _safe(r['Date_raw']),
                "النوع": _safe(r.get('النوع')),
                "Source": _safe(r['Source_raw']),
                "Region": _safe(r['Region_raw']),
                "Place of Coll.": _safe(r['Place of Coll._raw']),
                "Doner": _safe(r['Doner_raw']),
                "الوزن بالجرام": _safe(r.get('الوزن بالجرام')),
            },
        }
        records.append(rec)

    OUT.mkdir(parents=True, exist_ok=True)
    with (OUT / 'seedbank.json').open('w', encoding='utf-8') as f:
        json.dump({
            "$schema": "./seedbank.schema.json",
            "source_file": SRC.name,
            "generated_at": datetime.utcnow().isoformat() + 'Z',
            "record_count": len(records),
            "accessions": records,
        }, f, ensure_ascii=False, indent=2)

    with (OUT / 'seedbank.ndjson').open('w', encoding='utf-8') as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')

    # Build vocab summary for the schema/README
    vocab = {
        "categories": sorted({r['category']['ar'] for r in records if r['category']['ar']}),
        "sources_top": _top_counts(r['collection']['source'] for r in records),
        "regions_top": _top_counts(r['collection']['region'] for r in records),
        "families_top": _top_counts(r['taxonomy']['family'] for r in records),
    }
    with (OUT / 'vocab.json').open('w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(records)} records.")
    print(f"With germination tests: {sum(1 for r in records if r['flags']['has_germination_data'])}")
    print(f"Flagged as international trial: {sum(1 for r in records if r['flags']['is_international_trial'])}")
    print(f"Flagged as backup-copy label:   {sum(1 for r in records if r['flags']['is_backup_copy_label'])}")


def _safe(v):
    if v is None:
        return None
    if isinstance(v, float) and math.isnan(v):
        return None
    if isinstance(v, datetime):
        return v.date().isoformat()
    if isinstance(v, date):
        return v.isoformat()
    if isinstance(v, (int, float, str, bool)):
        return v
    return str(v)


def _top_counts(it, n=15):
    from collections import Counter
    c = Counter(x for x in it if x)
    return [{"value": v, "count": k} for v, k in c.most_common(n)]


if __name__ == '__main__':
    main()
