#!/usr/bin/env python3
"""
Recompute the national seed-bank numbers for the dashboard from the authoritative
master workbook (data-sources/raw/seed-bank.xlsx, sheet 'ALL', 3341 accessions).

Run:  python3 data-sources/convert_seedbank.py
Prints the values to paste into client/src/data/inventoryData.ts.

Notes on the source data:
- Col 'Code' (idx 1) = cold-room number (1..8) — matches the 8 storage rooms.
- 'النوع' (idx 10) = category: حقلي field / خضر veg / بستانية hort / بري wild / طبي medicinal.
- Germination tests live in cols 16,18,20,22,24,26 with dates in 17,19,21,23,25,27.
- Source has ditto marks ('"') and stray '.' — forward-filled before counting.
- Dates are mixed: datetime, Excel serials, and Hijri strings ('11-5-1439').
"""
import openpyxl, datetime
from collections import Counter, defaultdict

XLSX = "/home/emz/mega_disk/Seed-Station/seed-bank.xlsx"
import os
if not os.path.exists(XLSX):
    XLSX = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        "data-sources", "raw", "seed-bank.xlsx")

wb = openpyxl.load_workbook(XLSX, data_only=True)
rows = list(wb["ALL"].iter_rows(values_only=True))
data = [r for r in rows[1:] if r[0] is not None and str(r[0]).strip() != ""]

GERM_IDX = [16, 18, 20, 22, 24, 26]
DATE_IDX = [17, 19, 21, 23, 25, 27]
INTL = {"cimmyt", "acsad", "icrisat", "icarda"}


def s(r, i):
    return str(r[i]).strip() if i < len(r) and r[i] is not None else ""


def num(r, i):
    return r[i] if i < len(r) and isinstance(r[i], (int, float)) else None


def latest_germ(r):
    """Rightmost non-empty germination test value (the most recent test)."""
    for i in reversed(GERM_IDX):
        v = num(r, i)
        if v is not None:
            return v
    return None


def greg_year(val):
    """Best-effort Gregorian year from a germination-date cell."""
    if isinstance(val, datetime.datetime):
        return val.year if val.year >= 2000 else None
    if isinstance(val, (int, float)):  # Excel serial
        try:
            y = (datetime.datetime(1899, 12, 30) + datetime.timedelta(days=int(val))).year
            return y if 2000 <= y <= 2026 else None
        except Exception:
            return None
    txt = str(val).strip()
    # Hijri like "11-5-1439" -> AH year ~ +579 Gregorian
    parts = txt.replace("/", "-").split("-")
    for p in parts:
        if p.isdigit():
            n = int(p)
            if 1420 <= n <= 1446:
                return n + 579
            if 2000 <= n <= 2026:
                return n
    return None


# ── Source forward-fill (ditto marks) ──
def clean_sources():
    out, last = [], ""
    for r in data:
        v = s(r, 11)
        if v in ('"', '.', '،', ''):
            v = last
        else:
            last = v
        out.append(v)
    return out


sources = clean_sources()

# ── Per cold-room (Code) aggregation ──
ROOM_AR = {1: "غرفة التبريد الأولى", 2: "غرفة التبريد الثانية", 3: "غرفة التبريد الثالثة",
           4: "غرفة التبريد الرابعة", 5: "غرفة التبريد الخامسة", 6: "غرفة التبريد السادسة",
           7: "غرفة التبريد السابعة", 8: "غرفة التبريد الثامنة"}
rooms = defaultdict(lambda: {"n": 0, "wt": 0.0, "germ": [], "fam": Counter(), "cat": Counter(),
                             "year": defaultdict(list)})
for r in data:
    code = num(r, 1)
    if code is None:
        continue
    code = int(code)
    rm = rooms[code]
    rm["n"] += 1
    w = num(r, 15)
    if w and w > 0:
        rm["wt"] += w
    g = latest_germ(r)
    if g is not None:
        rm["germ"].append(g)
    if s(r, 5):
        rm["fam"][s(r, 5)] += 1
    if s(r, 10):
        rm["cat"][s(r, 10)] += 1
    for gi, di in zip(GERM_IDX, DATE_IDX):
        v = num(r, gi)
        if v is not None:
            y = greg_year(r[di] if di < len(r) else None)
            if y:
                rm["year"][y].append(v)

print("=== PER COLD ROOM (Code) ===")
for code in sorted(rooms):
    rm = rooms[code]
    germ = round(sum(rm["germ"]) / len(rm["germ"])) if rm["germ"] else 0
    fams = " / ".join(f for f, _ in rm["fam"].most_common(3))
    cats = " / ".join(c for c, _ in rm["cat"].most_common(2))
    hist = sorted((y, round(sum(v) / len(v), 1)) for y, v in rm["year"].items())
    print(f"Room {code}: n={rm['n']:5d}  weight_kg={rm['wt']/1000:7.2f}  germ%={germ:3d}  "
          f"cat=[{cats}]  fam=[{fams}]")
    print(f"         history={[{'year':str(y),'pct':p} for y,p in hist]}")

# ── SEEDBANK_TOTALS ──
total = len(data)
weights = [num(r, 15) for r in data if num(r, 15) and num(r, 15) > 0]
germ_latest = [(r, latest_germ(r)) for r in data]
tested = [g for _, g in germ_latest if g is not None]
high = sum(1 for g in tested if g >= 80)
low = sum(1 for g in tested if g < 80)
intl = sum(1 for i, r in enumerate(data)
           if sources[i].lower() in INTL or s(r, 14).lower() in INTL)
backup = sum(1 for r in data if "نسخ" in (s(r, 12) + s(r, 13)))
dts = [r[9] for r in data if isinstance(r[9], datetime.datetime) and r[9].year >= 2000]
print("\n=== SEEDBANK_TOTALS ===")
print(f"total={total}")
print(f"weighed={len(weights)}  totalWeightKg={sum(weights)/1000:.1f}  avgWeightG={sum(weights)/len(weights):.1f}")
print(f"withGerminationData={len(tested)}  highViability(>=80)={high}  lowViability(<80)={low}")
print(f"internationalTrials={intl}  backupCopies={backup}  saudiLocal={total-intl-backup}")
print(f"collectionStart={min(dts).date()}  collectionEnd={max(dts).date()}")

# ── CATEGORY_BREAKDOWN (النوع) ──
cat = Counter(s(r, 10) for r in data if s(r, 10))
print("\n=== CATEGORY_BREAKDOWN ===")
for k, v in cat.most_common():
    print(f"  {k}: {v}  ({100*v/total:.1f}%)")

# ── SOURCE_BREAKDOWN (cleaned) ──
src = Counter(x for x in sources if x and x not in ('"', '.'))
print("\n=== SOURCE_BREAKDOWN (top 8, ditto-filled) ===")
for k, v in src.most_common(8):
    print(f"  {k!r}: {v}")

# ── FAMILY_BREAKDOWN ──
fam = Counter(s(r, 5) for r in data if s(r, 5))
print("\n=== FAMILY_BREAKDOWN (top 8) ===")
for k, v in fam.most_common(8):
    print(f"  {k}: {v}")
