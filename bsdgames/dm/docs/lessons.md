# `dm` — Lessons Learned

> Every trick `dm` used, and where it lives in 2026. Read
> [`about.md`](./about.md) and [`architecture.md`](./architecture.md)
> first — this file references both.

---

## The mapping table

Every idea in `dm` corresponds to a whole industry today.

| `dm`'s 1987 mechanism | 2026 padanan | Notes |
|---|---|---|
| `argv[0]` dispatch via symlinks | **BusyBox** (1996), Perl `perl` command, Git plumbing (`git-*` binaries) | Same one-binary-many-names trick, now standard idiom. |
| Setgid `games` + `/usr/libexec/` `mode 750` | **Docker layers**, **snap/flatpak confinement**, **macOS `/usr/libexec/`**, **systemd `PrivateBin`** | Filesystem permissions were the first sandbox. |
| `/etc/dm.conf` (keyword-line policy) | **YAML for Kubernetes**, **Rego for OPA**, **HCL for Terraform**, **Puppet manifests**, **Ansible playbooks** | "Policy as code" was invented before the phrase existed. |
| `game hack 5 10 *` (per-app quotas) | **Kubernetes ResourceQuota**, **cgroups `memory.max`**, **systemd `MemoryHigh=`** | Per-application resource caps in 12 words. |
| `getloadavg()` gating | **HPA custom metrics**, **autoscaler cooldowns**, **Prometheus alert windows** | 15-min-avg smoothing is still the right window for many workloads. |
| Priority via `setpriority()` | **`nice(1)`** (still works), **cgroups `cpu.weight`**, **systemd `CPUWeight=`**, **K8s `PriorityClass`** | `dm` invoked exactly what the modern replacements wrap. |
| utmp user counting | **`prometheus-node-exporter`**, **`w(1)`**, **`who(1)`** | Same source of truth for "who is logged in?". |
| `time Monday 8 17` (business-hours) | **Okta/Duo conditional access**, **MDM work-hour policies**, **Google Workspace scheduled apps**, **crontab** | The 4-word DSL is still the semantic core. |
| `/etc/nogames` kill switch | **Feature flags** (LaunchDarkly, GrowthBook, Unleash), **`systemctl mask`**, **`kubectl scale --replicas=0`**, **CDN maintenance pages** | File-presence-as-flag is the simplest kill switch possible. |
| `badtty /dev/tty19` | **Conditional access based on device posture** (Okta, Beyond Corp), **Intune device compliance** | "Which endpoint is this?" is still a policy input. |
| Tab-separated log to `/var/log/dm.log` (behind `#ifdef LOG`) | **auditd**, **journald**, **SIEM ingestion (Splunk, ELK, Datadog)**, **AWS CloudTrail** | Audit logging is a whole industry. |
| Compile-time paths in `pathnames.h.in` | **`--config-file` flags**, **env-var overrides**, **XDG_CONFIG_HOME** | Runtime config location control is the modern norm. |

## Broader lessons

### 1. Filesystem permissions were the original sandbox

Before namespaces, seccomp, and capabilities, `dm` achieved
strong isolation with 3 filesystem tricks:

- Setgid the gatekeeper.
- Chmod the hidden directory 750.
- Symlink the "public" names.

That's it. **No kernel modifications, no daemons, no shared
memory.** Just POSIX file semantics.

Modern equivalent: a Docker container. But a container has to
lug along an entire OS image and a runtime. `dm`'s footprint:
~15 KB of binary + config.

**Takeaway:** understand the primitives before reaching for the
platform. Sometimes chmod is enough.

### 2. Multiplexed binaries are older than we think

Reading `dm.c`, you find `argv[0]` dispatch in 1987. BusyBox
"invented" this in 1996. Perl's `perl` did it. Git does it.
Toolchains like `x86_64-linux-gnu-gcc` vs `arm-linux-gnu-gcc` are
often the same binary.

**Takeaway:** the multiplexed-binary pattern is a reusable
distribution trick, not a novel invention. If you're shipping
a suite of related commands, consider one binary + symlinks
before N separate binaries.

### 3. Policy files beat command-line flags

`dm`'s config is 4 keywords in a 4-column format. Kubernetes'
config is thousands of YAML fields across dozens of CRDs.

Both work. The 1987 approach is:

- Human-writable.
- Comment-tolerant (any non-keyword line is skipped).
- Order-sensitive (default rule last).
- Compile-free (edit, save, `dm` re-reads on next run).

**Takeaway:** for simple policy, don't over-engineer the config
schema. `sscanf("%s%s%s", ...)` and case-insensitive keywords
work fine at small scale. Schema validation, JSON schema, and
Rego are wins only when scale demands them.

### 4. Kill switches should be dumb

`/etc/nogames` is a kill switch made of a filesystem entry.
Presence: on. Absence: off. Contents: reason string.

Compare:

- **LaunchDarkly:** a SaaS with a UI, API, audit log, RBAC, and
  monthly bill.
- **`touch /etc/nogames`:** a filesystem `touch`.

Both **work**. Choose based on the actual complexity you face.
For a 3-machine deployment, `touch` is the correct answer.

**Takeaway:** the simplest thing that could possibly work
sometimes really is the correct choice, even in 2026.

### 5. Observability was optional in 1987

Note the logging is `#ifdef LOG`. In 1987 you compiled it in or
out. If you didn't want the log, you didn't have it.

Modern default: everything logs everything. Kubernetes pods
scream JSON at stderr and someone bills you for it.

**Takeaway:** logging is a design choice. Consider what you
need vs. what feels professional.

### 6. Load average understanding

`dm` reads the **15-minute** load average. Not the 1-minute.

If you don't already know why: **1-minute is noise, 15-minute
is signal**. The 1-minute average spikes with every heavy
process; 15-minute smooths across enough time to reflect
"actual sustained pressure".

**Takeaway:** picking the right smoothing window is a real
engineering skill. When designing alerting/scaling thresholds,
default to longer windows and shorten only with evidence.

### 7. Silent tolerance vs strict validation

`dm`'s config parser silently skips malformed lines. Comments
work automatically because "any first character other than b/g/t"
is ignored.

Modern equivalent: **most linters** would flag this as
"insufficient error handling". And yet: this design has zero
support burden. No one has ever filed a bug about `dm`'s parser
because it doesn't reject anything.

**Takeaway:** strict validation is sometimes a self-inflicted
support cost. For internal, sysadmin-authored files, tolerance
can be a feature.

### 8. Compile-time vs runtime config

`_PATH_CONFIG`, `_PATH_HIDE`, `_PATH_NOGAMES`, `_PATH_LOG` are
all **`#define`**'d at build time.

Modern practice: `--config` flags, env vars, XDG dirs.

**Trade-off:** the 1987 approach means one binary, one
deployment. The modern approach means portability but adds
complexity (which env var wins? what if both are set? what if
XDG isn't set?).

**Takeaway:** compile-time paths are fine for tools tied to a
single installation. Runtime flexibility is a feature only when
you need multi-tenant or multi-environment support.

## Which idea aged least well?

**The `#ifdef LOG` block.** Compile-time feature flags for
logging are indefensible in 2026. Every modern tool should be
able to enable/disable logging at runtime via a flag or env var.

Everything else in `dm` has a defensible modern descendant. The
compile-time logging is the one clear "would definitely redesign".

## Which idea aged best?

**The `/etc/nogames` file kill switch.** Zero infrastructure,
absolute clarity, works on any Unix system, easy to explain to a
new sysadmin, and impossible to accidentally leave on. Modern
feature flag services are a whole industry — and yet
`touch /etc/nogames` remains the correct answer for a 3-machine
deployment. Timeless.

## For the modern engineer's toolkit

If you take one thing from reading `dm`:

**Look at what your platform gives you before adopting a new
platform.** In 1987, Berkeley engineers had the filesystem,
setgid, `execv`, `getloadavg`, and utmp. Those primitives
composed to produce declarative policy enforcement.

In 2026, you have all of that plus cgroups, systemd, containers,
kubernetes, service meshes, and policy engines. When solving a
problem, ask: which of these am I *actually* using, versus which
am I including because it's expected?

If the answer is "I have a 3-line problem and a 3000-file solution",
you've overshot. `dm` fits on one screen and does its job.

## See also

- Introduction: [`about.md`](./about.md).
- Mechanism: [`architecture.md`](./architecture.md).
- Genealogy: [`lineage.md`](./lineage.md).
- Skip ADR:
  [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).
