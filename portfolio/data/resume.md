# Olayinka — Resume

Source of truth for the portfolio site. Each section below feeds a component in
`portfolio/components/` (noted in the comment above it). Edit this file — or ask
Claude to — then run `/update-portfolio` (or say "update my resume and deploy")
to propagate changes, rebuild, and publish.

<!-- feeds: hero.html -->
## Personal

- **Name:** Olayinka
- **Title:** Software Engineer — Full-Stack, React & AI Integration
- **Location:** Lagos, Nigeria
- **Availability:** Remote
- **Summary:** Software engineer specialising in data-intensive web applications, AI integration, and performance optimization. Builds platforms that process hundreds of millions of data points in real time, adopted by global manufacturers. Combines pixel-perfect UI craft with full-stack depth — from React and TypeScript to Python, FastAPI, and RAG pipelines.

<!-- feeds: counters.html (Key Stats section) -->
## Stats

| Metric | Value |
|---|---|
| Projects Delivered | 148 |
| Users Reached | 3200000 |
| Client Satisfaction % | 99 |
| Years Experience | 12 |

<!-- feeds: tabs.html (Experience section — one tab per role) -->
## Experience

### Software Developer — Codeminer high tech a.g. (2026)

- Diagnosed and resolved a 45-day Kubernetes (K3s) API pod failure blocking backend deployments, restoring the QR-code backend service and a user-facing internal server error.
- Recovered an undocumented production server via a time-boxed Hetzner KVM rescue, resetting SSH/root credentials and backing up front- and back-end code under deadline pressure.
- Reconstructed a local dev environment for a RAG-based full-stack app that no team member could run, resolving CORS and bot-protection blockers.
- Migrated production code from a developer's personal GitHub into managed repositories, resolving commit-attribution issues during handover.

### Senior Front-end Engineer — Lykdat (2022–2026)

- Built a multi-modal fashion search interface supporting keyword, image, and URL-based search across 50+ global retail brands.
- Engineered the RAG pipeline powering the AI Assistant using Next.js API endpoints, grounded in real customer review data.
- Delivered tooling adopted by MAS Holdings — replacing a team of 30+ field researchers.
- Built a cross-brand aggregate insights page processing and visualizing sentiment, attribute, and ratings data across 553.7K+ products, 74 brands, and 106.2M customer reviews.
- Optimised front-end performance on data-intensive analysis pages rendering sentiment charts, attribute breakdowns, keyword clouds, and 800+ reviews simultaneously.

### Front-end Session Lead — Udacity (2022)

- Led weekly group sessions and webinars for 50–100 students with a 4.89/5 satisfaction rating.
- Mentored students 1-on-1 through front-end projects.

### Front-end Developer — Vatebra Limited (2017–2022)

- Built a custom Drupal theme for WAEC Nigeria still live after 8 years.
- Created custom WordPress themes for Genesys Health, Vatebra Tech Hub.
- Built Razor view templates for .NET web applications.
- Translated UI/UX designs into pixel-perfect interfaces, with cross-browser code reviews.

### Designer — Obaika Racing (2013–2016)

- Built a custom WordPress + WooCommerce theme for an end-to-end merchandise storefront (listings, cart, checkout).
- Produced car-wrap graphics, branded driver suits, and weekly promotional posters.

<!-- feeds: filter.html (Technologies section — categories: frontend, backend, devops, database) -->
## Technologies

- **Frontend:** TypeScript, Next.js, React, React Native, Redux, React Hooks, Tailwind CSS, jQuery, Bootstrap 5, GraphQL
- **Backend:** Python 3, FastAPI, Node.js, Django, PHP, Laravel, Razor Pages, RAG pipelines, LangGraph, AutoGen, Hugging Face Transformers, Claude API, OpenAI API
- **Databases:** MongoDB, MySQL, PostgreSQL, Firebase
- **DevOps:** CI/CD Pipelines, Vercel, GitHub, Docker, Kubernetes (K3s), AWS (EC2, Lambda)

<!-- feeds: project-tabs.html (Featured Projects tabs — one card per project, under its Category tab) -->
## Projects

### Pinsight

- **Category:** AI/ML
- **Skills:** React, Next.js, TypeScript, RAG Pipelines, REST
- **Link:** https://pinsight.lykdat.com

B2B fashion retail intelligence platform built as Senior Frontend Engineer — a multi-modal search interface across 50+ global brands, a product comparison page with sentiment charts, and a RAG-powered AI Assistant delivering insights from 14.6M+ reviews. Replaced 30+ field researchers at MAS Holdings, a global apparel manufacturer.

### Lykdat

- **Category:** Web
- **Skills:** React, Razzle, Server-side Rendering (SSR), Internationalization, i18next
- **Link:** https://lykdat.com

Consumer-facing fashion discovery platform for image-based search across multiple retailers. Built and maintained the hero section, image search entry point, and product browsing UI across neutral, women's, and men's categories, plus multilingual/localized shopping support.

### Woven Insights

- **Category:** Web
- **Skills:** React, Next.js, Framer, Payload CMS, Apollo
- **Link:** https://woveninsights.ai

Market intelligence platform for fashion professionals aggregating 506,000+ products, 305 retailers, and 8,800+ brands. Led end-to-end front-end development of the dashboard, filtering system, brands module, and forecasts, and migrated the marketing site from static Next.js to a self-manageable PayloadCMS build.

### Discovery Trip

- **Category:** Web
- **Skills:** Laravel, PHP, Amadeus Web Services, HTML, CSS
- **Link:** https://www.discoverytrip.net

Full-featured travel booking platform built solo — back-end architecture through front-end UI — using Laravel and the Amadeus API for real-time flight, hotel, car, and cruise bookings. Live and serving customers across Nigeria for over 10 years.

### Genesys Health

- **Category:** Web
- **Skills:** WordPress, PHP, Custom Themes, HTML5, CSS
- **Link:** https://www.genesys-health.com

Custom WordPress site built from scratch for a Lagos-based healthcare technology company, with a fully custom theme covering product showcases, demo videos, a request-a-demo form, and a news blog.

### Vatebra Tech Hub

- **Category:** Web
- **Skills:** WordPress, WordPress Plugins, PHP, Custom Themes, WordPress Multisite
- **Link:** TODO — add live URL

Website for a tech innovation and co-working space, built with a clean, professional design supporting the brand's mission of nurturing Nigeria's tech ecosystem — live and actively maintained for over four years.

### K3s Production Recovery

- **Category:** DevOps
- **Skills:** Kubernetes (K3s), Docker, Linux/SSH, Hetzner KVM
- **Link:** TODO — add live URL

Diagnosed and resolved a 45-day Kubernetes (K3s) API pod failure blocking backend deployments, restoring a production QR-code backend service.

### This Portfolio

- **Category:** Web
- **Skills:** jQuery, jQuery UI, HTML/CSS, Bash
- **Link:** TODO — add live URL

A dozen interactive jQuery components assembled into a single page by a bash build script.

### LifeWORTH HMO Enrollee

- **Category:** Mobile
- **Skills:** React Native, Expo, App Submission, Lottie
- **Link:** https://play.google.com/store/apps/details?id=com.lifeworthapps.enrollee

Enrollee-facing mobile app for a Nigerian HMO, giving members a single place to manage their health plan — a searchable directory of accredited providers, a digital HMO ID card, real-time benefits and coverage tracking, and an authorization history screen. Also built and documented the supporting API; live on Google Play and the App Store.

<!-- feeds: credentials.html (Education & Certifications) -->
## Education

- **B.Sc. Computer Science** — Federal University of Agriculture Abeokuta (2008–2012)

## Certifications

- **AI Engineer Production Track: Deploy LLMs & Agents at Scale** — Udemy (2026)
- **AI Engineer Agentic Track: The Complete Agent & MCP Course** — Udemy (2026)
- **AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents** — Udemy (2026)
- **Mentorship Nanodegree** — Udacity (2022)
- **React Nanodegree** — Udacity, Inc. (2018)

<!-- feeds: form.html / footer.html -->
## Contact

- **Email:** olayinka@example.com
- **LinkedIn:** https://linkedin.com/in/olayinka
