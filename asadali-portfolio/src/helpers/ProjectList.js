const ProjCS2 = process.env.PUBLIC_URL + '/assets/Projects/cs2-meta-engine.png';
const Proj0 = process.env.PUBLIC_URL + '/assets/Projects/ECommerceApp.png';
const Proj1 = process.env.PUBLIC_URL + '/assets/Projects/GPT-Clone.png';
const Proj2 = process.env.PUBLIC_URL + '/assets/Projects/Pokedex.png';
const Proj3 = process.env.PUBLIC_URL + '/assets/Projects/PlanetSimulation.png';
const Proj4 = process.env.PUBLIC_URL + '/assets/Projects/TriviaGame.jpeg';
const Proj5 = process.env.PUBLIC_URL + '/assets/Projects/CyclingApp.png';
const Proj6 = process.env.PUBLIC_URL + '/assets/Projects/MenuMate.png';
const Proj7 = process.env.PUBLIC_URL + '/assets/Projects/RoadOptimization.png';
const Proj8 = process.env.PUBLIC_URL + '/assets/Projects/pawnversation.png';
const Proj9 = process.env.PUBLIC_URL + '/assets/Projects/SESA-Website.png';

export const projectList = [
    {
        id: 10,
        name: "CS2 Meta Engine",
        description: "Pro-level CS2 demo analysis: grenade lineups, 2D match replay, economy tracking, heatmaps, and automated opponent scouting.",
        image: ProjCS2,
        skills: ["Python", "TypeScript", "Rust", "FastAPI", "React", "Vite", "Tailwind CSS", "Recharts", "Anthropic Claude"],
        github: "https://github.com/Twoos123/cs2-meta-engine",
        repoUrl: "https://github.com/Twoos123/cs2-meta-engine",
        demo: null,
        caseStudy: {
            tagline: "Turning raw .dem files into pro-level CS2 intel in seconds.",
            screenshotBase: "https://raw.githubusercontent.com/Twoos123/cs2-meta-engine/main/screenshots",
            origin: "This one started with a conversation. I was in an interview and the interviewer brought up OpenClaw and Claude, and how agentic AI workflows are already good enough to handle a real chunk of analyst-style work. It stuck with me, because I'd been sitting on a problem for a while: every time I wanted to dig into a CS2 match properly, I was either scrubbing demos manually or looking at Refrag and SCL, the two main paid platforms, each running around $70/team for roughly 6 slots. That conversation flipped the question for me. Instead of paying for the product, how far could I push things on my own? How much of that paid tool could I actually build with a good pipeline and the right AI in the loop?",
            problem: "I built this for myself. I'm currently top 2,000 in NA on Faceit, and at that level the gap between players is mostly about preparation: util timings, opponent tendencies, map-specific habits. Pro teams have analysts and six-figure tools to surface that stuff; solo ranked players don't. Refrag and SCL sell exactly this kind of intel, but locked behind a $70/team subscription built for orgs, not individuals. CS2 Meta Engine is me rebuilding that pipeline end-to-end so I can run the same analysis on my own demos, with AI doing the scouting work I'd otherwise pay an analyst for.",
            solution: "A three-layer system that ingests HLTV demos, extracts tick-level events into structured data, and surfaces the result as grenade lineups, 2D replays, economy breakdowns, heatmaps, and auto-generated anti-strat reports, all in a single React dashboard.",
            architecture: [
                {
                    title: "Parse Layer",
                    subtitle: "Rust + demoparser2",
                    desc: "Demos ship as binary blobs: multi-MB compressed tickstreams. A Rust-backed parser (demoparser2) extracts round-by-round events into typed Pydantic schemas, keeping memory flat even on pro-length matches.",
                    tech: ["Rust", "demoparser2", "Pydantic"],
                },
                {
                    title: "Service Layer",
                    subtitle: "FastAPI + SQLite",
                    desc: "A FastAPI server coordinates parsing, caches parsed demos in SQLite, and exposes REST endpoints for the frontend. Uvicorn workers handle concurrent parses; an RCON bridge hooks into live servers for real-time flows.",
                    tech: ["Python", "FastAPI", "SQLite", "uvicorn"],
                },
                {
                    title: "Experience Layer",
                    subtitle: "React + Vite + Recharts",
                    desc: "A React 18 dashboard renders the 2D replay, heatmaps, and economy charts. Recharts drives the round-flow and money graphs; a custom canvas layer handles tactical map overlays and lineup playback.",
                    tech: ["React", "Vite", "Tailwind CSS", "Recharts", "Axios"],
                },
                {
                    title: "Intelligence Layer",
                    subtitle: "Claude + HLTV scraper",
                    desc: "An Anthropic Claude integration reads parsed demos alongside a scraped HLTV corpus and generates opponent scouting reports (tendencies, default setups, eco preferences) in natural-language prose paired with structured callouts.",
                    tech: ["Anthropic Claude", "OpenRouter", "HLTV scraper"],
                },
            ],
            features: [
                { name: "Grenade lineup intelligence", file: "lineups.png", desc: "Every smoke/flash/molly across the match, grouped by map and map region, with playback timing and throwing position." },
                { name: "2D match replay", file: "replay.png", desc: "Scrub through the full round in a top-down view. Player trails, util impact, and contact points all layered on the tactical map." },
                { name: "Economy tracking", file: "economy.png", desc: "Money flow per round (buys, saves, force-buys, loss bonuses) with outcome overlays to spot econ-driven inflection points." },
                { name: "Heatmaps", file: "heatmap.png", desc: "Kill, death, and contact heatmaps per-player and per-map. Compares tendencies across matches to surface role patterns." },
                { name: "Automated scouting", file: "anti-strat.png", desc: "Claude reads parsed events + HLTV context and produces anti-strat reports: default setups, mid-round tells, timing preferences." },
            ],
            decisions: [
                {
                    q: "Why Rust for parsing?",
                    a: "Pure-Python CS2 parsers choke on 40-minute pro matches. demoparser2 is written in Rust and exposed to Python via PyO3 bindings: same API, roughly 10× faster on the event extraction loop, with no GIL contention when parsing multiple demos in parallel.",
                },
                {
                    q: "Why FastAPI over Flask or Express?",
                    a: "Demos are deeply structured, and Pydantic models double as parse targets and API contracts. FastAPI lets one schema drive both validation and OpenAPI docs, so the React client gets typed response shapes almost for free.",
                },
                {
                    q: "Why Claude for scouting?",
                    a: "Opponent scouting is a reasoning task, not a retrieval task. \"This team defaults long with util X when down 0-2\" isn't a vector search. Claude's long context lets me feed an entire tournament's worth of parsed events + HLTV articles into a single prompt and get coherent strategic narratives back.",
                },
                {
                    q: "Why SQLite, not Postgres?",
                    a: "Single-tenant local tool. SQLite is file-backed, zero-config, and fast enough for millions of tick events. Swapping to Postgres would add ops overhead without any product value, and the data never leaves the analyst's machine.",
                },
            ],
            learnings: [
                "Pydantic schemas as the single source of truth between parser and API saved more time than any other decision: changes in the demo shape surface as type errors, not runtime bugs.",
                "Designing the system around demo caching (parse once, query many) turned what should have been a 30-second wait per interaction into instant reads.",
                "Claude's scouting quality scales with the *shape* of context, not just the size. Round summaries + structured player stats beat raw event dumps for the same token budget.",
            ],
        },
    },
    {
        id: 0,
        name: "SESA Website",
        description: "Official website for the Software Engineering Students' Association (SESA) at uOttawa.",
        image: Proj9,
        skills: ["Next.js", "Vercel", "Supabase", "PostgreSQL", "TypeScript", "Tailwind CSS"],
        github: "https://github.com/uOttawaSESA/sesa-website",
        repoUrl: "https://github.com/uOttawaSESA/sesa-website",
        demo: "https://sesa-aegl.ca",
        caseStudy: {
            tagline: "The digital home for 3,000+ uOttawa software engineering students, shipped by a student team over 6+ months.",
            screenshotBase: "/assets/Projects/sesa",
            origin: "I'd been SESA's Dev Lead for about a year before this rebuild started, and honestly the team I inherited wasn't really alive. The club was practically dead. We built it up from the ground up when a few younger software engineering students hit me up wanting to get involved, and I pulled in a handful of friends to round out the team. When I was promoted to Co-Director in early 2025, I kept a hand on the technical side but finally had the scope to actually get the project off the ground. The January 2025 figma doc came out of that transition: lock in the design direction with our designer, stand up a proper dev team, and build the site SESA actually needed. Bilingual, fast, events, resources, team info, and sponsor visibility all in one place.",
            problem: "SESA represents around 3,000 EECS students at uOttawa. The old website technically existed, but it hadn't kept up with the association. Event info lived in Instagram story highlights, academic resources got buried in group chats, and sponsors had nowhere proper to be featured. We needed a hub that students would actually bookmark, that exec could update without breaking, and that read as polished enough to hand to potential partners like Microsoft or Amazon.",
            solution: "A bilingual Next.js site covering events, academic resources, social programming, an exec team spotlight, sponsor logos, an FAQ, and community links. Content is edited through Supabase, deployed on Vercel, and served statically where possible so first-load performance stays fast on campus Wi-Fi.",
            architecture: [
                {
                    title: "Frontend",
                    subtitle: "Next.js 14 + Tailwind",
                    desc: "Next.js App Router gives us SSR where SEO matters (event pages, team) and static rendering everywhere else. Tailwind + a shared design system keep visual consistency as different devs pick up different pages.",
                    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
                },
                {
                    title: "Content Layer",
                    subtitle: "Supabase + PostgreSQL",
                    desc: "Supabase handles auth, row-level security, and the Postgres DB behind every dynamic section (events, team, sponsors). Exec members update content through Supabase Studio, no redeploy needed.",
                    tech: ["Supabase", "PostgreSQL"],
                },
                {
                    title: "Localization",
                    subtitle: "French + English",
                    desc: "uOttawa is officially bilingual. Every page has an /en and /fr variant driven by a shared translation schema, so French-speaking students aren't second-class visitors.",
                    tech: ["i18n routing"],
                },
                {
                    title: "Delivery",
                    subtitle: "Vercel + edge caching",
                    desc: "Deployed on Vercel with preview environments for every PR. Static assets sit on the edge, API routes handle mutations, and the whole thing rebuilds in under a minute.",
                    tech: ["Vercel", "Edge runtime"],
                },
            ],
            features: [
                { name: "Events & calendar", file: "events.png", desc: "Workshops, career panels, and social nights surfaced with filter chips (All / Past / Today / Upcoming) so students can jump straight to what's happening this week." },
                { name: "Resources library", file: "resources.png", desc: "Free study materials curated by the academic team: course notes, problem walkthroughs, and tutor links, all searchable and tagged by course." },
                { name: "Meet the team", file: "about.png", desc: "Tabs for every team (Co-Directors, Partnerships, Events, Communications, Development, Academic, Advisors) so students can put names to the people running SESA." },
                { name: "Partners & sponsors", files: ["sponsors.png", "sponsors-2.png", "sponsors-3.png"], desc: "Logo wall for industry partners (Microsoft, Amazon, Deloitte, Ciena, Bank of Canada, and more) plus a direct path for new sponsors to get in touch." },
                { name: "Get in touch", file: "contact.png", desc: "Inquiry form for collaborations, sponsorships, and student questions. Routed to exec so nothing gets lost in the Instagram DMs." },
            ],
            decisions: [
                {
                    q: "Why Next.js over a simpler static generator?",
                    a: "We knew we wanted bilingual routing, server components for SEO-sensitive pages, and room to add authenticated exec tooling later. Next.js gave us all three without forcing us to migrate stacks once the project outgrew a static site.",
                },
                {
                    q: "Why Supabase instead of a headless CMS?",
                    a: "We weren't paying for Contentful on a student budget, and our content model is simple enough (events, people, sponsors) that a Postgres table per concept was cleaner than mapping CMS primitives. Supabase also gave us auth for free when we eventually wire up an exec dashboard.",
                },
                {
                    q: "Why let the designer run ahead of the devs?",
                    a: "The site had to read as polished enough to show to companies like Microsoft and Amazon. Our in-house designer spent weeks in Figma iterating on a system (type scale, color tokens, component library) before devs wrote a line of real code. That upfront work is what kept the final site feeling cohesive as different devs picked up different pages.",
                },
                {
                    q: "Why 6+ months to ship?",
                    a: "Student team, student schedules. We had 4-5 developers at a time, all taking classes and doing internships, rotating availability. We optimized for consistent weekly progress over heroic sprints, which meant the timeline stretched but nobody burned out.",
                },
            ],
            learnings: [
                "Committing to a design system before building anything saved us more engineering time than any framework choice. By the time devs opened VS Code, every component already had a Figma spec.",
                "A team of 4-5 part-time student devs ships about as fast as one full-time dev, but with way better bus-factor. Code reviews caught real bugs and spread knowledge across the exec.",
                "Our designer clutched up hard. A lot of student-built sites look like student-built sites; this one doesn't, and that's almost entirely because someone owned visual design as a first-class discipline from day one.",
                "The January 2025 figma doc from the exec team turned out to be worth its weight in gold. Every time scope-creep showed up, we had a reference to point back to.",
            ],
            credits: {
                blurb: "None of this happens without the team. Shoutout to my fellow Co-Directors for carrying the non-code side of SESA as hard as I pushed the technical side, and to the dev team who actually wrote the code that shipped.",
                groups: [
                    {
                        label: "Co-Directors",
                        people: [
                            { name: "Rolf Addoumie", linkedin: "https://www.linkedin.com/in/rolfaddoumie/" },
                            { name: "Kelly Gao", linkedin: "https://www.linkedin.com/in/kellymiugao/" },
                        ],
                    },
                    {
                        label: "Design",
                        people: [
                            { name: "Riki Mcalear", linkedin: "https://www.linkedin.com/in/riki-mcalear/" },
                        ],
                    },
                    {
                        label: "Dev Team",
                        people: [
                            { name: "Tazim Khan", linkedin: "https://www.linkedin.com/in/tazim-khan/" },
                            { name: "Adam Thompson-Sharpe", linkedin: "https://www.linkedin.com/in/adamts/" },
                            { name: "Raman Gupta", linkedin: "https://www.linkedin.com/in/gupta-raman/" },
                        ],
                    },
                ],
            },
        },
    },
    {
        id: 1,
        name: "PawnVersation",
        description: "A voice-controlled chess game with AI opponent powered by Groq for natural language interaction.",
        image: Proj8,
        skills: ["Vite", "TypeScript", "React", "Tailwind CSS", "Groq API"],
        github: "https://github.com/Twoos123/pawnversation",
        repoUrl: "https://github.com/Twoos123/pawnversation",
        demo: "https://pawnversation.vercel.app"
    },
    {
        id: 2,
        name: "ShopEase",
        description: "A full-stack e-commerce platform with secure payments, user authentication, and admin dashboard.",
        image: Proj0,
        skills: ["React", "Node.js", "Express", "Stripe", "MongoDB", "Redis", "Tailwind CSS", "Cloudinary"],
        github: "https://github.com/Twoos123/ecomm-mern",
        repoUrl: "https://github.com/Twoos123/ecomm-mern",
        demo: null
    },
    {
        id: 3,
        name: "SmartChat",
        description: "An intelligent chatbot application powered by OpenAI's GPT with a modern React interface.",
        image: Proj1,
        skills: ["React", "Chakra UI", "OpenAI"],
        github: "https://github.com/Twoos123/GPT-Clone-AA",
        repoUrl: "https://github.com/Twoos123/GPT-Clone-AA",
        demo: null
    },
    {
        id: 4,
        name: "Pokedex",
        description: "A comprehensive Pokemon database app with GraphQL API and interactive search features.",
        image: Proj2,
        skills: ["Node.js", "Express", "GraphQL", "React"],
        github: "https://github.com/Twoos123/Pokedex",
        repoUrl: "https://github.com/Twoos123/Pokedex",
        demo: null
    },
    {
        id: 5,
        name: "Planet Simulation",
        description: "A physics-based solar system simulation with realistic orbital mechanics and gravity effects.",
        image: Proj3,
        skills: ["Python"],
        github: "https://github.com/Twoos123/Python-Planetsim",
        repoUrl: "https://github.com/Twoos123/Python-Planetsim",
        demo: null
    },
    {
        id: 6,
        name: "Trivia Game",
        description: "An interactive trivia game with multiple categories, scoring system, and real-time feedback.",
        image: Proj4,
        skills: ["React", "Node.js", "JavaScript"],
        github: "https://github.com/Twoos123/TriviaGame",
        repoUrl: "https://github.com/Twoos123/TriviaGame",
        demo: null
    },
    {
        id: 7,
        name: "Cycling App",
        description: "A mobile fitness tracking app for cyclists with route mapping and performance analytics.",
        image: Proj5,
        skills: ["Kotlin", "Java", "Firebase", "SQLite", "Android Studio"],
        github: "https://github.com/Twoos123/SEG200-Project",
        repoUrl: "https://github.com/Twoos123/SEG200-Project",
        demo: null
    },
    {
        id: 8,
        name: "MenuMate",
        description: "An AI-powered restaurant menu recommendation system using natural language processing.",
        image: Proj6,
        skills: ["React", "Flask", "Co:Here NLP"],
        github: "https://github.com/Twoos123/MenuMate",
        repoUrl: "https://github.com/Twoos123/MenuMate",
        demo: null
    },
    {
        id: 9,
        name: "RoadOptimization",
        description: "A traffic optimization algorithm simulator for improving urban road network efficiency.",
        image: Proj7,
        skills: ["Java", "JavaScript", "HTML5", "CSS3"],
        github: "https://github.com/Twoos123/RoadOptimization",
        repoUrl: "https://github.com/Twoos123/RoadOptimization",
        demo: null
    }
];