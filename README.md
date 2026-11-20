# AdGuardHome merged DNS blocklist

Merged DNS blocklist for AdGuardHome, built from `sources.json` with AdGuard HostlistCompiler.

## AdGuardHome blocklist URL

Use this URL as a custom DNS blocklist:

```text
https://raw.githubusercontent.com/alexniculescu23/adguardhome-lists/main/public/adguardhome-merged.txt
```

AdGuardHome path:

```text
Filters -> DNS blocklists -> Add blocklist -> Add a custom list
```

Suggested name:

```text
Alex Merged DNS Security List
```

## Build and publish

Run:

```bash
./build-and-publish.sh
```

The script will download all sources, compile/merge/deduplicate them, update `public/adguardhome-merged.txt`, generate metadata/report files, commit, and push to GitHub.

## Latest report

```text
https://raw.githubusercontent.com/alexniculescu23/adguardhome-lists/main/public/adguardhome-merged.report.md
```

The report shows how useful each list is:

```text
- total rules
- normalized domains
- unique domains contributed
- overlap with other lists
```

## Requirements

Node.js `^22.22.2` or `>=24` (Node 23 is not supported by hostlist-compiler 3.x).

```bash
npm i -g @adguard/hostlist-compiler@3.0.0
```

## New PC setup

```bash
git clone https://github.com/alexniculescu23/adguardhome-lists.git
cd adguardhome-lists
npm i -g @adguard/hostlist-compiler@3.0.0
chmod +x build-and-publish.sh
./build-and-publish.sh
```

GitHub push uses an SSH key via `remote.origin.pushurl`; see `NEW-MACHINE-SETUP.md` for the full setup.

## Important

This build currently includes HaGeZi TIF Medium, the smaller HaGeZi threat-intelligence tier intended for resource-constrained AdGuard Home deployments.
