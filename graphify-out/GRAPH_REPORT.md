# Graph Report - backend  (2026-09-06)

## Corpus Check
- 143 files · ~76,576 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 816 nodes · 1590 edges · 57 communities (43 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.83)
- Token cost: 34,735 input · 2,175 output

## Community Hubs (Navigation)
- Query Hooks and Form Fields
- Sidebar Navigation
- Nest Bootstrap and Error Filter
- Webapp TypeScript Config
- Tags Endpoint
- Webapp Package Manifest
- Router Route Tree
- Command Palette and Dialog
- Webapp Runtime Dependencies
- Apps Endpoint DTOs
- Backend TypeScript Config
- Combobox Primitives
- Webapp Dev Tooling Deps
- Backend Module Wiring
- shadcn Component Registry
- Admin Form Schemas
- Backend Lint and Package Config
- User Groups Endpoint
- Button and Sheet Primitives
- Apps Controller Routes
- Tabs and Badge Primitives
- Class Name Utilities
- Webapp Scripts
- Design Token Generator
- Header and Avatar
- Backend Runtime Dependencies
- Backend Scripts
- Apps Service and Mapper
- Root Layout and Providers
- Playwright Chip Tests
- Backend Dev Dependencies
- Input Group Primitives
- PWA Manifest
- Apps List Query DTO
- Vite Build Config
- Chip Component
- Nest CLI Config
- Prisma Seed Data
- Apps Repository
- Theme Toggle
- Router Registration
- Prettier Configs
- Architecture Documentation
- Admin Layout Tabs
- Help and Support Route
- Prisma Seed Hook
- BFF Architecture Diagram
- State Management Docs
- Webapp ESLint Config
- pnpm Build Allowlist
- Vite Deps Package Marker
- Product Screenshot
- Entity Relationship Diagram
- Repository README

## God Nodes (most connected - your core abstractions)
1. `cn()` - 132 edges
2. `react` - 28 edges
3. `@nestjs/common` - 21 edges
4. `compilerOptions` - 21 edges
5. `useAppStore` - 21 edges
6. `CreateAppDto` - 20 edges
7. `compilerOptions` - 18 edges
8. `lucide-react` - 17 edges
9. `useTagsQuery()` - 15 edges
10. `PrismaService` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Docker Compose Configuration` --conceptually_related_to--> `Backend README`  [INFERRED]
  docker-compose.yml → backend/README.md
- `System Architecture Diagram` --references--> `Backend for Frontend (BFF)`  [INFERRED]
  docs/System Architecture — apps-store.png → docs/architecture.md
- `AvatarBadge()` --calls--> `cn()`  [EXTRACTED]
  webapp/src/components/ui/avatar.tsx → webapp/src/lib/utils.ts
- `AvatarGroup()` --calls--> `cn()`  [EXTRACTED]
  webapp/src/components/ui/avatar.tsx → webapp/src/lib/utils.ts
- `AvatarGroupCount()` --calls--> `cn()`  [EXTRACTED]
  webapp/src/components/ui/avatar.tsx → webapp/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (57 total, 11 thin omitted)

### Community 0 - "Query Hooks and Form Fields"
Cohesion: 0.06
Nodes (69): react, react-hook-form, sonner, @tanstack/react-query, @tanstack/react-router, TagChip(), TagChipProps, Input() (+61 more)

### Community 1 - "Sidebar Navigation"
Cohesion: 0.08
Nodes (36): lucide-react, SidebarLogo(), SidebarToggle(), SidebarToggleProps, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps (+28 more)

### Community 2 - "Nest Bootstrap and Error Filter"
Cohesion: 0.07
Nodes (28): AppModule, Module, AppsModule, Module, AllExceptionsFilter, asHttpException(), CODE_BY_STATUS, pick() (+20 more)

### Community 3 - "Webapp TypeScript Config"
Cohesion: 0.06
Nodes (32): compilerOptions, allowImportingTsExtensions, baseUrl, jsx, lib, module, moduleResolution, noEmit (+24 more)

### Community 4 - "Tags Endpoint"
Cohesion: 0.11
Nodes (18): CreateTagDto, IsBoolean, IsString, Matches, MaxLength, MinLength, UpdateTagDto, TagsController (+10 more)

### Community 5 - "Webapp Package Manifest"
Cohesion: 0.06
Nodes (30): cmdk, @fontsource-variable/geist, @hookform/resolvers, jsdom, @mockoon/cli, prettier-plugin-classnames, prettier-plugin-merge, prettier-plugin-tailwindcss (+22 more)

### Community 6 - "Router Route Tree"
Cohesion: 0.09
Nodes (28): @tanstack/react-start, Route, Route, Route, Route, Route, Route, Route (+20 more)

### Community 7 - "Command Palette and Dialog"
Cohesion: 0.13
Nodes (24): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+16 more)

### Community 8 - "Webapp Runtime Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, @fontsource-variable/geist, @hookform/resolvers, lucide-react (+19 more)

### Community 9 - "Apps Endpoint DTOs"
Cohesion: 0.11
Nodes (20): AppIconDto, IsString, MaxLength, CreateAppDto, IsBoolean, IsOptional, IsString, Matches (+12 more)

### Community 10 - "Backend TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+15 more)

### Community 11 - "Combobox Primitives"
Cohesion: 0.12
Nodes (18): @base-ui/react, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup() (+10 more)

### Community 12 - "Webapp Dev Tooling Deps"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, jsdom, @mockoon/cli, @playwright/test, prettier, prettier-plugin-classnames, prettier-plugin-merge (+15 more)

### Community 13 - "Backend Module Wiring"
Cohesion: 0.20
Nodes (11): APP_INCLUDE, CommonModule, Module, CurrentUser, CurrentUserService, DEV_USER_SUBJECT, Injectable, PrismaService (+3 more)

### Community 14 - "shadcn Component Registry"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 15 - "Admin Form Schemas"
Cohesion: 0.21
Nodes (13): zod, appIconSchema, HEX_COLOR, nameUniqueRefinement(), SEMVER, createAppFormSchema(), CreateAppFormValues, createTagFormSchema() (+5 more)

### Community 16 - "Backend Lint and Package Config"
Cohesion: 0.12
Nodes (15): description, eslint, prettier, @types/node, typescript, name, private, @nestjs/cli (+7 more)

### Community 17 - "User Groups Endpoint"
Cohesion: 0.20
Nodes (7): listEnvelope, Controller, Get, UserGroupsController, Injectable, UserGroupResponse, UserGroupsService

### Community 18 - "Button and Sheet Primitives"
Cohesion: 0.16
Nodes (9): Button(), buttonVariants, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+1 more)

### Community 19 - "Apps Controller Routes"
Cohesion: 0.19
Nodes (8): AppsController, Body, Controller, Get, Param, Patch, Post, Query

### Community 20 - "Tabs and Badge Primitives"
Cohesion: 0.22
Nodes (10): class-variance-authority, PageTab, PageTabsProps, Badge(), badgeVariants, Tabs(), TabsContent(), TabsList() (+2 more)

### Community 21 - "Class Name Utilities"
Cohesion: 0.17
Nodes (9): clsx, tailwind-merge, escapeRegExp(), HighlightText(), HighlightTextProps, Label(), Separator(), FONT_SIZE_TOKENS (+1 more)

### Community 22 - "Webapp Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, check, dev, format, generate-routes, lint, mock (+5 more)

### Community 23 - "Design Token Generator"
Cohesion: 0.18
Nodes (3): build_color_palette(), normalize_hex(), resolve_reference()

### Community 24 - "Header and Avatar"
Cohesion: 0.26
Nodes (8): TODO: implement notifications panel, TODO: implement dark mode, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 25 - "Backend Runtime Dependencies"
Cohesion: 0.18
Nodes (11): dependencies, class-transformer, class-validator, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/mapped-types, @nestjs/platform-express (+3 more)

### Community 26 - "Backend Scripts"
Cohesion: 0.18
Nodes (11): scripts, build, check, dev, format, generate, lint, migrate (+3 more)

### Community 27 - "Apps Service and Mapper"
Cohesion: 0.38
Nodes (5): AppResponse, toAppResponse(), toStatusEnum(), AppsService, Injectable

### Community 28 - "Root Layout and Providers"
Cohesion: 0.20
Nodes (7): next-themes, @tanstack/react-devtools, @tanstack/react-router-devtools, Header(), AppSidebar(), Toaster(), queryClient

### Community 29 - "Playwright Chip Tests"
Cohesion: 0.29
Nodes (6): @playwright/test, CHIP_SPECS, ChipSpec, FIGMA_COLORS, HOVER_SPECS, REMOVE_ICON

### Community 30 - "Backend Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @nestjs/cli, @nestjs/schematics, prettier, prisma, @types/express, @types/node (+2 more)

### Community 31 - "Input Group Primitives"
Cohesion: 0.27
Nodes (8): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea(), Textarea()

### Community 32 - "PWA Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 33 - "Apps List Query DTO"
Cohesion: 0.29
Nodes (7): ListAppsQueryDto, IsOptional, IsString, Type, IsInt, Max, Min

### Community 34 - "Vite Build Config"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite, @tanstack/devtools-vite, vite, vite-plugin-svgr, @vitejs/plugin-react, config

### Community 35 - "Chip Component"
Cohesion: 0.38
Nodes (4): Chip(), ChipProps, chipVariants, SPECIMENS

### Community 36 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 37 - "Prisma Seed Data"
Cohesion: 0.33
Nodes (4): APPS, GROUPS, prisma, TAGS

### Community 38 - "Apps Repository"
Cohesion: 0.40
Nodes (3): AppWithRelations, AppsRepository, Injectable

### Community 39 - "Theme Toggle"
Cohesion: 0.53
Nodes (5): applyThemeMode(), getInitialMode(), ThemeMode, ThemeToggle(), toggleMode()

### Community 40 - "Router Registration"
Cohesion: 0.33
Nodes (5): getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 42 - "Architecture Documentation"
Cohesion: 0.40
Nodes (5): Backend README, CLAUDE.md Project Guide, Docker Compose Configuration, System Architecture Specification, Keycloak Identity Provider

### Community 43 - "Admin Layout Tabs"
Cohesion: 0.40
Nodes (3): PageTabs(), ADMIN_TABS, Route

## Knowledge Gaps
- **297 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Command Palette and Dialog` to `Query Hooks and Form Fields`, `Sidebar Navigation`, `Chip Component`, `Admin Layout Tabs`, `Combobox Primitives`, `Button and Sheet Primitives`, `Tabs and Badge Primitives`, `Class Name Utilities`, `Header and Avatar`, `Input Group Primitives`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `react` connect `Query Hooks and Form Fields` to `Sidebar Navigation`, `Chip Component`, `Webapp Package Manifest`, `Theme Toggle`, `Command Palette and Dialog`, `Combobox Primitives`, `Button and Sheet Primitives`, `Class Name Utilities`, `Header and Avatar`, `Input Group Primitives`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Webapp Runtime Dependencies` to `Webapp Package Manifest`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Query Hooks and Form Fields` be split into smaller, more focused modules?**
  _Cohesion score 0.0602020202020202 - nodes in this community are weakly interconnected._
- **Should `Sidebar Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07751937984496124 - nodes in this community are weakly interconnected._
- **Should `Nest Bootstrap and Error Filter` be split into smaller, more focused modules?**
  _Cohesion score 0.06970128022759602 - nodes in this community are weakly interconnected._