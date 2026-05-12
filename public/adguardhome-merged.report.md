# AdGuardHome merged list report

Compiled at: `2026-05-12T06:31:27.774Z`

## Output

- Latest merged file: `/home/aniculescu/adguardhome/dist/merged-latest.txt`
- Stamped merged file: `/home/aniculescu/adguardhome/dist/merged-2026-05-12T06-31-27-774Z.txt`
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

## Per-source contribution

| Source | Raw rules | Text unique in source | Text unique only | Domains | Domain unique only | Domain unique % |
|---|---:|---:|---:|---:|---:|---:|
| OISD Blocklist Big | 405,197 | 405,197 | 166,385 | 405,197 | 136,883 | 33.78% |
| Dandelion Sprout's Anti-Malware List | 12,780 | 12,780 | 1,811 | 12,376 | 1,396 | 11.28% |
| HaGeZi Pro++ | 242,729 | 242,729 | 117,245 | 242,729 | 117,218 | 48.29% |
| HaGeZi URL Shortener | 9,882 | 9,882 | 8,565 | 9,882 | 8,547 | 86.49% |
| HaGeZi Threat Intelligence Feeds - Full | 1,292,988 | 1,292,988 | 1,068,375 | 1,292,988 | 1,060,823 | 82.04% |
| Phishing Army | 145,083 | 145,083 | 145,083 | 145,083 | 60,986 | 42.04% |
| Malicious URL Blocklist URLHaus | 17,027 | 17,027 | 14,320 | 17,027 | 14,320 | 84.10% |
| ROad-Block Romanian Adblock | 1,335 | 1,334 | 1,279 | 451 | 369 | 81.82% |

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
- TIF Full is included here for measurement. Do not push the final list to the router until we inspect the output size and counts.
