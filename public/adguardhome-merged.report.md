# AdGuardHome merged list report

Compiled at: `2026-05-12T06:35:02.097Z`

## Output

- Latest merged file: `/home/aniculescu/adguardhome/dist/merged-latest.txt`
- Stamped merged file: `/home/aniculescu/adguardhome/dist/merged-2026-05-12T06-35-02-097Z.txt`
- Output bytes: **36,219,933**
- Output non-comment rules: **1,673,951**
- Output unique textual rules: **1,673,951**
- Output normalized domains: **1,673,534**

## Input summary before HostlistCompiler

- Sources: **8**
- Raw non-comment rules: **2,127,021**
- Sum of unique textual rules per source: **2,127,020**
- Global unique textual rules: **1,806,934**
- Duplicate textual entries across sources: **320,086** (15.05%)
- Sum of normalized domains per source: **2,125,733**
- Global unique normalized domains: **1,721,513**
- Duplicate normalized-domain entries across sources: **404,220** (19.02%)

## List usefulness

Sorted by unique normalized domains contributed.

### HaGeZi Threat Intelligence Feeds - Full

- Raw rules: **1,292,988**
- Normalized domains: **1,292,988**
- Unique domains contributed: **1,060,823** (82.04%)
- Overlap with other lists: **232,165** (17.96%)

### OISD Blocklist Big

- Raw rules: **405,197**
- Normalized domains: **405,197**
- Unique domains contributed: **136,883** (33.78%)
- Overlap with other lists: **268,314** (66.22%)

### HaGeZi Pro++

- Raw rules: **242,729**
- Normalized domains: **242,729**
- Unique domains contributed: **117,218** (48.29%)
- Overlap with other lists: **125,511** (51.71%)

### Phishing Army

- Raw rules: **145,083**
- Normalized domains: **145,083**
- Unique domains contributed: **60,986** (42.04%)
- Overlap with other lists: **84,097** (57.96%)

### Malicious URL Blocklist URLHaus

- Raw rules: **17,027**
- Normalized domains: **17,027**
- Unique domains contributed: **14,320** (84.10%)
- Overlap with other lists: **2,707** (15.90%)

### HaGeZi URL Shortener

- Raw rules: **9,882**
- Normalized domains: **9,882**
- Unique domains contributed: **8,547** (86.49%)
- Overlap with other lists: **1,335** (13.51%)

### Dandelion Sprout's Anti-Malware List

- Raw rules: **12,780**
- Normalized domains: **12,376**
- Unique domains contributed: **1,396** (11.28%)
- Overlap with other lists: **10,980** (88.72%)

### ROad-Block Romanian Adblock

- Raw rules: **1,335**
- Normalized domains: **451**
- Unique domains contributed: **369** (81.82%)
- Overlap with other lists: **82** (18.18%)


## Top duplicate normalized domains

- 5x `gateway.lighthouse.storage`
- 4x `0121.click`
- 4x `0213233.cfd`
- 4x `02ip.ru`
- 4x `03122e72f0.com`
- 4x `0365alert.com`
- 4x `09239-174328543.shop`
- 4x `0chnik-pl.shop`
- 4x `0fde401291120.click`
- 4x `0network.com`
- 4x `0oorku4.top`
- 4x `1-straussvipeu-online.shop`
- 4x `100conversions.com`
- 4x `10230374783013.lat`
- 4x `10384977980745.shop`
- 4x `12097623.cfd`
- 4x `126325g2.sbs`
- 4x `13.accessbenefitscenter.com`
- 4x `14edqrd42.top`
- 4x `174257d5.sbs`
- 4x `1826346f7.sbs`
- 4x `182652h2.sbs`
- 4x `183528x56.sbs`
- 4x `1974275r5.sbs`
- 4x `1kea-eur.shop`
- 4x `1xbet.mobi`
- 4x `1xsinga.com`
- 4x `1xslot-ua.com`
- 4x `2026-lidl.shop`
- 4x `2026.72.chat`

## Notes

- Domain overlap is approximate normalization. HostlistCompiler may optimize further through Compress and validation.
- The final output count is the important number for what AdGuardHome will ingest as a single list.
- This build includes HaGeZi TIF Full. Test router RAM carefully before disabling the separate lists.
