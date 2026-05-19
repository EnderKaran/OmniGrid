# OmniGrid

OmniGrid is a real-time warehouse management system (WMS) engineered for high-density, low-latency logistics operations. The platform integrates an administrative bento-grid dashboard, real-time telemetry, historical analysis, and a specialized WebRTC scanner client for mobile operators.

## Key Subsystems

### 1. Administrative Telemetry Dashboard
An ultra-dense console designed for high-density information display:
- **Real-Time Telemetry:** Implements Pusher WebSocket channels for immediate, client-side updates.
- **Stock Control Interface:** Offers compact row-level inventory controls with optimistic UI states.
- **Stopwatch Profiling:** Tracks search and filter latency in real-time at microsecond resolution.
- **Time Machine HUD:** Simulates dynamic historical states and inventory reconstruction via time-travel sliders.
- **SKU Ingestion Panel:** Includes validation and automatic placement controls querying physical shelves.

### 2. Field Operator WebRTC Scanner Client
A dedicated, low-contrast terminal optimized for warehouse el-terminals:
- **Adaptive Visual HUD:** Embedded WebRTC video stream with visual vizors and target overlays.
- **Sensory Audio Integration:** Uses Web Audio API synthesizers to emit confirmation beeps and error buzzes.
- **Speech Synthesis:** Operates Web Speech API (TTS) to provide screen-free inventory verification.

### 3. Database Layer & Performance Indexing
- Built on Neon Serverless PostgreSQL using Drizzle ORM.
- Mapped explicit B-Tree database indexes on all critical foreign keys to eliminate sequential scans, achieving a sub-millisecond query execution time.
- Pre-seeded with 520 industrial-grade products, 60 storage shelves, and order logs.

---

## Performance Auditing

Standard SQL 6-table join query:
```sql
SELECT w.id, w.name, z.id, z.name, r.id, r.name, s.id, s.name, p.id, p.name, pv.id, pv.name
FROM warehouses w
LEFT JOIN zones z ON w.id = z.warehouse_id
LEFT JOIN racks r ON z.id = r.zone_id
LEFT JOIN shelves s ON r.id = s.rack_id
LEFT JOIN products p ON s.id = p.shelf_id
LEFT JOIN product_variants pv ON p.id = pv.product_id
LIMIT 100;
```

**EXPLAIN ANALYZE Metrics (Neon Cloud instance):**
- **Planning Time:** 0.470 ms
- **Execution Time:** 0.287 ms

These metrics confirm that database-side execution resolves in sub-millisecond time. Real-world end-to-end execution latency locally is ~180-260ms, which is bound by HTTP network transmission (RTT) overhead to the Neon central Europe cloud.

---

## Configuration

Provide a `.env.local` file at the root of the project with the following variables:

```bash
# Neon Database
DATABASE_URL=your-postgresql-url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Pusher Telemetry
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Apply database migrations
```bash
node node_modules/drizzle-kit/bin.cjs push
```

### 3. Seed database
```bash
npx tsx src/db/seed.ts
```

### 4. Execute performance benchmarks
```bash
npx tsx src/db/test-performance.ts
```

### 5. Launch the development server
```bash
npm run dev
```

---

## Codebase Audit

We enforce code quality, accessibility, and security using systematic checks:
- **Security Audit:** Automated checks for secrets leak and dependency hazards.
- **TypeScript Linter:** Strict typing validation.
- **SEO & Accessibility Audit:** Word-boundary layout checks and aria-label requirements for all custom UI controls.

```bash
python .agent/scripts/checklist.py .
```
```text
Total Checks: 6
Passed: 6
Failed: 0
Skipped: 0

All checks PASSED
```

---

## License

OmniGrid is distributed under the MIT License.
