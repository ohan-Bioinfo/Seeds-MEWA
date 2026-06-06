#!/usr/bin/env python3
"""
Convert the raw, messy per-crop passport CSVs into clean canonical CSVs for the
dashboard, Saudi-only, and emit the aggregate numbers for passportData.ts.

Run once from the repo root:  python3 data-sources/convert_passports.py

Output (UTF-8, comma-delimited) → client/public/<crop>_passport.csv with header:
  accessionId,localName,genus,species,scientificName,source,arabicName,country,province,location

- `location` is the canonical Saudi region (or "" if Saudi but region unknown).
  Runtime normalizeRegionName() is then a pass-through, so the live table and the
  static REGION_CROP_DATA computed here stay perfectly consistent.
- Only rows whose collection COUNTRY is Saudi Arabia are kept (international dropped).
- Raw inputs live in data-sources/raw/ (moved there as provenance, not fetched at runtime).
"""
import csv
import os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data-sources", "raw")
OUT = os.path.join(ROOT, "client", "public")

CANON = ["accessionId", "localName", "genus", "species", "scientificName",
         "source", "arabicName", "country", "province", "location"]


def norm_region(s: str) -> str:
    """Mirror of normalizeRegionName() in dataLoader.ts (incl Eastern Province)."""
    t = (s or "").strip().lower()
    if not t or t in ("na", "unknow", "unknown", "0", "farm", "saudi arabia",
                       "saudi-arabia", "ksa", "saudi"):
        return ""
    aliases = [
        (("aseer", "asir", "abha", "tanoum", "beni malak", "belasmar", "belahmar", "elmaween"), "Aseer"),
        (("baha",), "Al-Baha"),
        (("najran",), "Najran"),
        (("riyadh", "dilam", "tumair", "tumayr", "kharj", "dawadmi", "majm"), "Riyadh"),
        (("qaseem", "qassim", "buraidah", "unaiz", "onaiz", "unayz", "bakariah", "bidayei", "qawara"), "Qaseem"),
        (("hail",), "Hail"),
        (("jazan", "jizan", "gizan", "damad", "sabya", "sabia", "baish"), "Jazan"),
        (("tabuk",), "Tabuk"),
        (("taif", "mecca", "makkah", "saad"), "Taif"),
        (("hasa", "ahsa", "hofuf", "dammam", "qatif", "eastern"), "Eastern"),
    ]
    for keys, region in aliases:
        if any(k in t for k in keys):
            return region
    return ""


def is_saudi(country: str) -> bool:
    c = (country or "").strip().lower()
    return "saudi" in c or "ksa" in c


def cell(row, idx):
    return row[idx].strip() if (idx is not None and idx < len(row)) else ""


def first_region(row, idxs):
    """First mappable canonical region across candidate columns; else ''."""
    for idx in idxs:
        r = norm_region(cell(row, idx))
        if r:
            return r
    return ""


# crop key -> (raw filename, delimiter, encoding, column map)
# column map values are source indices; region_src is a list (priority order)
SOURCES = {
    "breadWheat": ("Triticum_aestivum-passport_curated_final.csv", ",", "utf-8-sig",
                   dict(acc=0, local=None, genus=2, species=3, sci=4, source=5, country=6, prov=7, region=[8])),
    "durumWheat": ("Triticum turgidum-metadata_cleaned.csv", ",", "utf-8-sig",
                   dict(acc=0, local=None, genus=2, species=3, sci=4, source=5, country=6, prov=8, region=[8])),
    "millet":     ("Pearl Millet Passport information.csv", ",", "cp1256",
                   dict(acc=2, local=None, genus=5, species=6, sci=7, source=8, country=9, prov=11, region=[10])),
    "fabaBean":   ("passport-faba-bean.csv", "\t", "utf-8-sig",
                   dict(acc=1, local=7, genus=3, species=4, sci=5, source=6, country=8, prov=10, region=[9, 10])),
    "papaya":     ("Papaya Pas information.csv", ",", "utf-8-sig",
                   dict(acc=2, local=None, genus=4, species=5, sci=6, source=7, country=8, prov=10, region=[9])),
    "barley":     ("Barley Passport.csv", ",", "utf-8-sig",
                   dict(acc=1, local=7, genus=3, species=4, sci=5, source=6, country=8, prov=9, region=[10, 9])),
    "coffee":     ("CoffeePassport(1).csv", ",", "utf-8-sig",
                   dict(acc=1, local=7, genus=3, species=4, sci=5, source=6, country=8, prov=10, region=[10, 9], arabic=7)),
}

# Static crops with no new CSV — keep prior REGION_CROP_DATA + CROP_META values.
STATIC_REGION = {
    "sorghum": {"Jazan": 14, "Riyadh": 71},
    "sesame": {"Jazan": 10, "Aseer": 1, "Al-Baha": 2},
    "mango": {},
}
REGION_ORDER = ["Jazan", "Aseer", "Al-Baha", "Riyadh", "Taif", "Qaseem",
                "Najran", "Hail", "Eastern", "Tabuk"]


def convert():
    saudi_totals = {}
    region_crop = defaultdict(lambda: defaultdict(int))  # region -> crop -> count

    for crop, (fname, delim, enc, m) in SOURCES.items():
        path = next((p for p in (os.path.join(RAW, fname), os.path.join(ROOT, fname),
                                  os.path.join(OUT, fname)) if os.path.exists(p)), None)
        if path is None:
            raise FileNotFoundError(fname)
        with open(path, encoding=enc, errors="replace", newline="") as fh:
            rows = list(csv.reader(fh, delimiter=delim))[1:]
        rows = [r for r in rows if any((c or "").strip() for c in r[:6])]

        out_rows = []
        for r in rows:
            if not is_saudi(cell(r, m["country"])):
                continue
            acc = cell(r, m["acc"])
            if not acc:
                continue
            region = first_region(r, m["region"])
            out_rows.append([
                acc,
                cell(r, m.get("local")),
                cell(r, m["genus"]),
                cell(r, m["species"]),
                cell(r, m["sci"]),
                cell(r, m["source"]),
                cell(r, m.get("arabic")),
                cell(r, m["country"]),
                cell(r, m["prov"]),
                region,
            ])
            if region:
                region_crop[region][crop] += 1

        out_path = os.path.join(OUT, f"{crop.lower()}_passport.csv")
        with open(out_path, "w", encoding="utf-8", newline="") as fh:
            w = csv.writer(fh)
            w.writerow(CANON)
            w.writerows(out_rows)
        saudi_totals[crop] = len(out_rows)
        print(f"  wrote {os.path.relpath(out_path, ROOT):42s} rows={len(out_rows)}")

    # merge static crops
    for crop, regions in STATIC_REGION.items():
        for reg, n in regions.items():
            region_crop[reg][crop] += n

    print("\n--- CROP_META.totalAccessions (Saudi-only) ---")
    for crop, n in saudi_totals.items():
        print(f"  {crop}: {n}")

    print("\n--- REGION_CROP_DATA block (paste into passportData.ts) ---")
    print("export const REGION_CROP_DATA: RegionCropCounts[] = [")
    for reg in REGION_ORDER:
        crops = region_crop.get(reg, {})
        if not crops:
            continue
        total = sum(crops.values())
        print(f"  {{\n    region: \"{reg}\",")
        print("    crops: {")
        for crop in sorted(crops, key=lambda c: -crops[c]):
            print(f"      {crop}: {crops[crop]},")
        print(f"    }},\n    total: {total},\n  }},")
    print("];")


if __name__ == "__main__":
    convert()
