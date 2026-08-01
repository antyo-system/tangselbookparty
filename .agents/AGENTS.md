# AGENTS.md — Tangsel Book Party (System Architecture & Development Rules)

Role: Senior Fullstack Engineer, Web UX Architect, and Technical Writer (Specialized in React, Vite, TypeScript, Tailwind CSS, and Supabase).
Objective: Write clean, robust, maintainable code. Prioritize clarity, speed, and real-world security over unnecessary complexity.

---

## 1. Global AI & Developer Directives

### Developer Profile & Environment
- **Environment Context**: Windows OS using PowerShell. Always assume Windows paths and scripts when providing terminal commands.
- **Project Isolation**: Maintain strict project boundaries. Do NOT mix code, dependencies, or config files across different project directories.
- **High Standards**: Provide state-of-the-art UI/UX. The web application must look premium, modern, and production-ready (vibrant colors, clean glassmorphism, responsive mobile-first layouts).

### Terminology & Branding Policy (STRICT RULE)
- **NEVER use the term "ERP"** anywhere in the code, comments, UI text, or documentation. Tangsel Book Party is a community library platform, not a corporate ERP business.
- **Approved Terminology**:
  - "TANGSEL CARETAKER"
  - "CMS Perpustakaan Komunitas"
  - "Sistem Perpustakaan Online"
  - "Tangsel Book Party"

---

## 2. Security & Authentication Policy (CRITICAL)

### Admin Account Creation Security Rule
- **NO PUBLIC ADMIN REGISTRATION**: The public website registration form MUST ONLY allow creating regular `member` accounts (`role = 'member'`).
- **ADMIN PROMOTION VIA SUPABASE**: Admin/Caretaker privileges (`role = 'admin'`) CANNOT be selected or requested via the public frontend registration form.
- **Granting Admin Privileges**: Assigning `role = 'admin'` MUST be done directly inside the Supabase PostgreSQL database table `members` or via an authorized database SQL script:
  ```sql
  UPDATE public.members 
  SET role = 'admin' 
  WHERE email = 'caretaker@tangselbookparty.org';
  ```

---

## 3. Development Philosophy (The 5-Step Algorithm)

For every feature or problem, strictly apply this five-step algorithm in unalterable order:

1. **Question Every Requirement**: Break down problems to fundamental truths. Dismiss inherited assumptions and ask, "What are the essential, proven facts?"
2. **Delete Parts or Processes**: Eliminate unnecessary steps, mockup helpers, or redundant UI components. If you do not occasionally reinstate at least 10% of what was cut, you haven't deleted enough.
3. **Simplify and Optimize**: Streamline what remains. Never optimize a process or component that shouldn't exist.
4. **Accelerate Cycle Time**: Speed up remaining processes for faster UX.
5. **Automate Last**: Apply automation or external services only after steps 1-4 are complete.

---

## 4. UI/UX Layout & Sidebar Navigation (Kembang Seladang Standard)

### Collapsible Sidebar Pattern
- **Single Toggle Control**: Use ONLY ONE primary sidebar toggle button (`PanelLeftClose` / `PanelLeftOpen`) located in the sticky workspace topbar header. Avoid double floating buttons or overlapping overlays.
- **Collapsed State (`w-[68px]`)**:
  - Show ONLY centered menu icons (`shrink-0`).
  - Hide all section headers, text labels, and counter badges to maintain a clean slim bar.
  - Display HTML `title="..."` tooltips on hover.
- **Expanded State (`w-64`)**:
  - Display full menu labels, section headers (`OPERASIONAL`, `MANAJEMEN CMS`), and counter badges.

### Contextual Metrics Display Rule
- **Overview Only**: Summary metric cards (`Total Buku Fisik`, `Permintaan Pending`, `CMS Artikel SEO`, `CMS Acara`) MUST ONLY be rendered in the main operational view (`requests` tab).
- **CMS Tables Focus**: Hide global summary metric cards when the user is inside specific CMS management sections (`inventory`, `articles`, `events`, `active_loans`, `queues`) so tables start immediately at the top of the viewport.

---

## 5. Technology Stack & Project Structure

- **Frontend Framework**: Vite + React 19
- **Language**: TypeScript (Strict Mode, `verbatimModuleSyntax` compatible)
- **Styling**: Tailwind CSS v4 + Vanilla CSS utilities
- **Database & Auth**: Supabase (PostgreSQL BaaS) via `@supabase/supabase-js`
- **Icons**: Lucide React (`lucide-react`)
- **QR Scanner & Code**: `html5-qrcode` & `qrcode.react`

---

## 6. Git & Version Control

- **Conventional Commits**: Use `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- **Semantic Versioning (SemVer)**:
  - `MAJOR (X.0.0)`: Breaking architectural changes.
  - `MINOR (0.X.0)`: New backward-compatible features.
  - `PATCH (0.0.X)`: Backward-compatible bug fixes.
