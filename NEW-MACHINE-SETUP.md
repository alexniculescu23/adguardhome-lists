# AdGuardHome lists: new machine setup (macOS or Windows + WSL)

This guide sets up a new laptop to build and publish this list automatically.

The laptop builds the list and publishes it to GitHub. AdGuardHome (on the router or
server) downloads it from:

```text
https://raw.githubusercontent.com/alexniculescu23/adguardhome-lists/main/public/adguardhome-merged.txt
```

You don't have to change anything in AdGuardHome when you switch laptops.

## What the old setup did

| Item | Old value (WSL) |
|---|---|
| Repo location | `~/projects/adguardhome-lists` |
| Trigger | A personal startup script that called `build-and-publish.sh`, run by hand |
| Entry point | `./build-and-publish.sh`, run from inside the repo |
| Fetch remote | `https://github.com/alexniculescu23/adguardhome-lists.git` (the script resets this on every run) |
| Push remote | `git@github.com:alexniculescu23/adguardhome-lists.git` (a separate `pushurl`, so the script leaves it alone) |
| SSH key | `~/.ssh/id_ed25519_github` (personal GitHub key) |
| Repo-local git identity | `user.name` and `user.email` of the personal GitHub account |
| Node | `v22.23.4` via nvm |
| Compiler | `@adguard/hostlist-compiler@3.0.0`, installed globally with npm (upgraded from 2.1.1 on 2026-11-20) |
| Other tools | `git`, `python3` (used only for `json.tool`), `sha256sum`, `find`, `wc`, `date` |

What `build-and-publish.sh` does on each run:

1. Downloads the 20 enabled sources from `sources.json`.
2. Runs `build-merged-report.mjs`, which calls `hostlist-compiler`.
3. Writes the result to `public/adguardhome-merged.txt` plus `.meta.txt`, `.sha256.txt`, `.lines.txt` and `.report.md`.
4. Commits the result and pushes it to `main`.

A run downloads about 20 lists and pushes a list of about 19 MB.

## Pitfalls to know before you start

1. **Repo history size.** Every run commits the whole 19 MB list, so `.git` is already about 435 MB.
   Clone with `--filter=blob:none`. You still get the full history, but old list files
   aren't downloaded, and pushing works normally.
2. **The script needs a repo-local git identity.** It exits with code `2` if `user.name`
   or `user.email` is empty. Set them locally so your work identity isn't used for
   personal commits.
3. **Push must go through SSH.** The script forces `origin` to the HTTPS URL on every run.
   Pushing still works only because `remote.origin.pushurl` points to SSH. Set this
   after cloning (see Common steps below).
4. **Compiler 3.0.0 needs Node `^22.22.2` or `>=24`. Node 23 isn't supported.**
   `nvm install 22` installs a suitable 22.x. Pin the compiler to `@3.0.0` so you don't
   pick up a future major version without testing it. If the machine sits behind an HTTP
   proxy, 3.0.0 only uses `HTTP(S)_PROXY` when `NODE_USE_ENV_PROXY=1` is also exported.
5. **`sha256sum` on macOS.** It's built in from macOS 15 (Sequoia) onwards. On macOS 14
   or older, install GNU coreutils (macOS step 1).
6. **WSL: keep the repo on the Linux filesystem** (`~/projects/...`), not under
   `/mnt/c/...`. Under `/mnt/c` it's much slower, and the executable bit and line
   endings can break.
7. **Background pushes can't ask for a passphrase.** If the SSH key has a passphrase,
   load it into an agent: the macOS Keychain, or `keychain` on WSL (see below).
   Otherwise the automatic run fails, by design, and you'll see why in the log.

---

## Option A: macOS

### 1. Base tools

```bash
xcode-select --install          # git, python3, ssh (skip if already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"   # optional, only for coreutils
sw_vers -productVersion         # macOS 14 or older? then also run:
brew install coreutils          # provides sha256sum on macOS 14 and older
```

### 2. Node 22 via nvm, plus the compiler

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# the installer adds the nvm lines to ~/.zshrc; open a new terminal, then:
nvm install 22
nvm alias default 22
npm install --global @adguard/hostlist-compiler@3.0.0
node --version && hostlist-compiler --help >/dev/null && echo OK
```

### 3. SSH key for personal GitHub

Either copy `~/.ssh/id_ed25519_github` and `~/.ssh/id_ed25519_github.pub` from the old
machine, or create a new key and add it on GitHub (Settings → SSH and GPG keys):

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "<your-github-email>" -f ~/.ssh/id_ed25519_github
cat ~/.ssh/id_ed25519_github.pub   # paste this into GitHub
```

Add the following to `~/.ssh/config`. `UseKeychain` and `AddKeysToAgent` let background
pushes work with a key that has a passphrase:

```sshconfig
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes
```

```bash
chmod 600 ~/.ssh/config ~/.ssh/id_ed25519_github
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_github   # stores the passphrase in the Keychain once
ssh -T git@github.com                                    # expect: "Hi alexniculescu23! ..."
```

### 4. Clone and configure the repo

Then continue with **Common steps** below.

### 5. Shell startup hook

macOS uses zsh by default, so add the hook to **`~/.zshrc`**, below the nvm lines
(see **Shell hook**).

---

## Option B: new Windows machine with WSL

### 1. Install WSL (in Windows PowerShell as Administrator)

```powershell
wsl --install -d Ubuntu
```

Reboot if asked, open Ubuntu, and create your Linux user. Run every step below
**inside the Ubuntu shell**.

### 2. Base tools

```bash
sudo apt update && sudo apt install -y git openssh-client python3 curl ca-certificates keychain
```

`coreutils` (which includes `sha256sum`) is already part of Ubuntu.

### 3. Node 22 via nvm, plus the compiler

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
exec bash
nvm install 22
nvm alias default 22
npm install --global @adguard/hostlist-compiler@3.0.0
node --version && hostlist-compiler --help >/dev/null && echo OK
```

### 4. SSH key for personal GitHub

Copy the old key or create a new one, the same way as macOS step 3. Use this
`~/.ssh/config` (no `UseKeychain`, which only exists on macOS):

```sshconfig
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
```

```bash
chmod 600 ~/.ssh/config ~/.ssh/id_ed25519_github
ssh -T git@github.com
```

If the key has a passphrase, add this line to `~/.bashrc` **above** the AdGuard hook.
It asks for the passphrase once per Windows boot and then reuses the agent:

```bash
eval "$(keychain --eval --quiet id_ed25519_github)"
```

### 5. Clone and configure the repo

Then continue with **Common steps** below.

### 6. Shell startup hook

Add the hook to **`~/.bashrc`**, below the nvm lines (see **Shell hook**).

---

## Common steps: clone and configure (macOS and WSL)

```bash
mkdir -p ~/projects && cd ~/projects
git clone --filter=blob:none https://github.com/alexniculescu23/adguardhome-lists.git
cd adguardhome-lists

# Push over SSH. The script resets the fetch URL to HTTPS on every run, but keeps pushurl.
git remote set-url --push origin git@github.com:alexniculescu23/adguardhome-lists.git

# Repo-local identity, required by build-and-publish.sh
git config --local user.name  "<your-name>"
git config --local user.email "<your-github-email>"

chmod +x build-and-publish.sh
git remote -v      # fetch = https://..., push = git@github.com:...
```

First run, in the foreground, to check that everything works:

```bash
./build-and-publish.sh
```

The run should end with `DONE.` and the AdGuardHome URL, and a new
"Update AdGuardHome merged list" commit should be on GitHub.

## Shell hook: a command plus an automatic run once a day

Paste this block **at the end** of `~/.zshrc` (macOS) or `~/.bashrc` (WSL), after the nvm
lines, because the hook needs `node` and `hostlist-compiler` on `PATH`. The same block
works in both zsh and bash.

```bash
# >>> adguardhome-lists >>>
export ADGUARD_LISTS_DIR="$HOME/projects/adguardhome-lists"

adguard-update() {
  (cd "$ADGUARD_LISTS_DIR" && ./build-and-publish.sh)
}

_adguard_daily() {
  local cache="$HOME/.cache/adguard-lists"
  local today
  today="$(date +%F)"
  mkdir -p "$cache"
  [[ -f "$cache/last-success" && "$(cat "$cache/last-success")" == "$today" ]] && return 0
  if ! mkdir "$cache/lock" 2>/dev/null; then
    kill -0 "$(cat "$cache/lock/pid" 2>/dev/null)" 2>/dev/null && return 0
    rm -rf "$cache/lock"
    mkdir "$cache/lock" 2>/dev/null || return 0
  fi
  echo "[adguard] daily list update running in background (log: $cache/last-run.log)"
  ( (
      sh -c 'echo "$PPID"' > "$cache/lock/pid"
      if GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="ssh -o BatchMode=yes" \
         adguard-update >"$cache/last-run.log" 2>&1; then
        echo "$today" > "$cache/last-success"
      fi
      rm -rf "$cache/lock"
    ) & )
}

[[ $- == *i* && -z "${ADGUARD_SKIP_AUTO:-}" ]] && _adguard_daily
# <<< adguardhome-lists <<<
```

How the hook behaves:

- **First terminal of the day:** starts `build-and-publish.sh` in the background and
  prints one line. The terminal is ready to use right away, and output goes to
  `~/.cache/adguard-lists/last-run.log`.
- **Later terminals the same day:** nothing happens. A date stamp is written only after
  a successful run, so a failed run is retried the next time you open a terminal.
- **Several terminals opened at once:** a lock directory with a PID check ensures only
  one build runs. If a build is killed, the next shell clears the stale lock.
- **Manual run, any time:** `adguard-update`. This runs in the foreground with full output.
- **Non-interactive shells** (scripts, IDE tasks) never start it. To skip it for one
  session, run `ADGUARD_SKIP_AUTO=1 zsh` (or `bash`).
- **Background runs never prompt.** `BatchMode=yes` and `GIT_TERMINAL_PROMPT=0` make an
  authentication problem fail and get logged, instead of blocking.

Useful commands:

```bash
cat ~/.cache/adguard-lists/last-run.log     # last background run
rm ~/.cache/adguard-lists/last-success      # force the next shell to run again today
```

On WSL, the automatic trigger is opening the Ubuntu or WSL terminal tab. That includes
Windows Terminal if Ubuntu is its default profile, which is the usual "start of the CLI".

## Final checklist

- [ ] `node --version` shows v22.22.2+ (or v24+) and `hostlist-compiler --version` shows `3.0.0`
- [ ] `ssh -T git@github.com` greets `alexniculescu23`
- [ ] `git -C ~/projects/adguardhome-lists remote -v` shows an HTTPS fetch URL and an SSH push URL
- [ ] `git -C ~/projects/adguardhome-lists config --local user.email` shows your personal GitHub email
- [ ] A foreground `./build-and-publish.sh` ends with `DONE.`
- [ ] The hook is in `~/.zshrc` (macOS) or `~/.bashrc` (WSL), and a new terminal prints the `[adguard]` line once
- [ ] `public/adguardhome-merged.meta.txt` on GitHub shows today's `compiled_at_utc`
