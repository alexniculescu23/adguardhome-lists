# AdGuardHome merged list report

Compiled at: `2026-05-27T13:52:29.760Z`

## Output

- Latest merged file: `/home/aniculescu/adguardhome/dist/merged-latest.txt`
- Stamped merged file: `/home/aniculescu/adguardhome/dist/merged-2026-05-27T13-52-29-760Z.txt`
- Output bytes: **38,103,456**
- Output non-comment rules: **1,780,172**
- Output unique textual rules: **1,780,172**
- Output normalized domains: **1,777,792**

## Input summary before HostlistCompiler

- Sources: **19**
- Raw non-comment rules: **2,540,736**
- Sum of unique textual rules per source: **2,540,735**
- Global unique textual rules: **2,034,866**
- Duplicate textual entries across sources: **505,869** (19.91%)
- Sum of normalized domains per source: **2,538,675**
- Global unique normalized domains: **1,909,614**
- Duplicate normalized-domain entries across sources: **629,061** (24.78%)

## List usefulness

Sorted by unique normalized domains contributed.

### HaGeZi Threat Intelligence Feeds - Full

- Raw rules: **1,309,410**
- Normalized domains: **1,309,410**
- Unique domains contributed: **1,113,272** (85.02%)
- Overlap with other lists: **196,138** (14.98%)

### OISD Blocklist Big

- Raw rules: **324,519**
- Normalized domains: **324,519**
- Unique domains contributed: **92,578** (28.53%)
- Overlap with other lists: **231,941** (71.47%)

### ShadowWhisperer Tracking List

- Raw rules: **113,278**
- Normalized domains: **113,278**
- Unique domains contributed: **62,584** (55.25%)
- Overlap with other lists: **50,694** (44.75%)

### HaGeZi Pro++

- Raw rules: **245,879**
- Normalized domains: **245,879**
- Unique domains contributed: **59,871** (24.35%)
- Overlap with other lists: **186,008** (75.65%)

### Phishing Army

- Raw rules: **145,759**
- Normalized domains: **145,759**
- Unique domains contributed: **56,759** (38.94%)
- Overlap with other lists: **89,000** (61.06%)

### AdGuard DNS filter

- Raw rules: **164,021**
- Normalized domains: **163,275**
- Unique domains contributed: **46,762** (28.64%)
- Overlap with other lists: **116,513** (71.36%)

### Steven Black hosts

- Raw rules: **83,067**
- Normalized domains: **83,067**
- Unique domains contributed: **45,020** (54.20%)
- Overlap with other lists: **38,047** (45.80%)

### 1Hosts Lite

- Raw rules: **96,006**
- Normalized domains: **96,006**
- Unique domains contributed: **17,867** (18.61%)
- Overlap with other lists: **78,139** (81.39%)

### Malicious URL Blocklist URLHaus

- Raw rules: **16,899**
- Normalized domains: **16,899**
- Unique domains contributed: **14,947** (88.45%)
- Overlap with other lists: **1,952** (11.55%)

### The Big List of Hacked Malware Web Sites

- Raw rules: **13,468**
- Normalized domains: **13,467**
- Unique domains contributed: **12,981** (96.39%)
- Overlap with other lists: **486** (3.61%)

### HaGeZi URL Shortener

- Raw rules: **9,878**
- Normalized domains: **9,878**
- Unique domains contributed: **9,620** (97.39%)
- Overlap with other lists: **258** (2.61%)

### Dandelion Sprout's Anti-Malware List

- Raw rules: **12,413**
- Normalized domains: **12,005**
- Unique domains contributed: **1,497** (12.47%)
- Overlap with other lists: **10,508** (87.53%)

### HaGeZi DynDNS Blocklist

- Raw rules: **1,490**
- Normalized domains: **1,490**
- Unique domains contributed: **1,217** (81.68%)
- Overlap with other lists: **273** (18.32%)

### ROad-Block Romanian Adblock

- Raw rules: **1,335**
- Normalized domains: **451**
- Unique domains contributed: **354** (78.49%)
- Overlap with other lists: **97** (21.51%)

### HaGeZi Badware Hoster Blocklist

- Raw rules: **925**
- Normalized domains: **925**
- Unique domains contributed: **168** (18.16%)
- Overlap with other lists: **757** (81.84%)

### NoCoin Filter List

- Raw rules: **313**
- Normalized domains: **313**
- Unique domains contributed: **167** (53.35%)
- Overlap with other lists: **146** (46.65%)

### AWAvenue Ads Rule

- Raw rules: **861**
- Normalized domains: **856**
- Unique domains contributed: **147** (17.17%)
- Overlap with other lists: **709** (82.83%)

### AdGuard DNS Popup Hosts filter

- Raw rules: **1,198**
- Normalized domains: **1,198**
- Unique domains contributed: **36** (3.01%)
- Overlap with other lists: **1,162** (96.99%)

### HaGeZi DNS Rebind Protection

- Raw rules: **17**
- Normalized domains: **0**
- Unique domains contributed: **0** (0.00%)
- Overlap with other lists: **0** (0.00%)


## Top duplicate normalized domains

- 8x `trackvoluum.com`
- 7x `actuallysheep.com`
- 7x `analytics.pointdrive.linkedin.com`
- 7x `analytics.query.yahoo.com`
- 7x `analytics.s3.amazonaws.com`
- 7x `analytics.tiktok.com`
- 7x `beacon.qq.com`
- 7x `betr-for-tod.com`
- 7x `cdntechone.com`
- 7x `coinerra.com`
- 7x `copyrightaccesscontrols.com`
- 7x `crentgate.com`
- 7x `criteo.net`
- 7x `d1lxhc4jvstzrp.cloudfront.net`
- 7x `debridleech.com`
- 7x `events.redditmedia.com`
- 7x `flurry.com`
- 7x `geo.yahoo.com`
- 7x `goads.pro`
- 7x `hashing.win`
- 7x `hexagon-analytics.com`
- 7x `hfc195b.com`
- 7x `hm.baidu.com`
- 7x `illustriousoatmeal.com`
- 7x `iot-eu-logser.realme.com`
- 7x `iot-logser.realme.com`
- 7x `iyfbodn.com`
- 7x `log.pinterest.com`
- 7x `metrics.icloud.com`
- 7x `metrics.mzstatic.com`

## Notes

- Domain overlap is approximate normalization. HostlistCompiler may optimize further through Compress and validation.
- The final output count is the important number for what AdGuardHome will ingest as a single list.
- This build includes HaGeZi TIF Full. Test router RAM carefully before disabling the separate lists.
