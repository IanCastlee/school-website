# 🏫 Official Public High School Institutional Web Portal

A modern, accessible, and high-performance public high school web portal engineered with **React 19**, **Vite**, **Tailwind CSS v4**, and an Atomic Design component architecture.

Designed for Philippine public high schools (DepEd compliance, Transparency Seal, School Improvement Plans, Student Accomplishments, and Online Public Assistance Desk) with a white-label branding configurator.

---

## 🌟 Key Features

* **Atomic Design Architecture**: Built with modular atoms, molecules, organisms, and page templates.
* **5 Core Institutional Pages**:
  1. **Home (`/`)**: Official seal hero, institutional charter, DepEd K to 12 curriculum offerings, and featured highlights.
  2. **Accomplishments (`/#accomplishments`)**: Filterable achievements catalog (Sports, Arts, Culture, Academics).
  3. **Plans & Projects (`/#projects`)**: School Improvement Plan (SIP) initiatives and progress tracking.
  4. **Transparency Seal (`/#transparency`)**: Public financial accountability, MOOE fund allocations, and verifiable disclosure documents.
  5. **Contact Us (`/#contact`)**: Electronic public assistance desk and interactive inquiry form.
* **Pro Classic Admin Dashboard (`/#admin`)**:
  * Collapsible sidebar with header toggle button.
  * Instant White-Label School Branding Configurator (rebrand school name, acronym, founding year, address, and contact details on the fly).
  * Full Create, Read, Update, and Delete (CRUD) operations for Achievements, Projects, Transparency Documents, and Stakeholder Inquiries.
* **Responsive & Mobile-Optimized**:
  * Smart mobile navbar displaying clean school acronyms (e.g. `GNHS`) to avoid layout cramping on smaller screens.
  * Fast client-side global portal search.

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   * Public Portal: [http://localhost:5173](http://localhost:5173)
   * Admin Portal: [http://localhost:5173/#admin](http://localhost:5173/#admin)

---

## 🔐 Admin Access & Credentials

The portal includes an isolated Admin route accessible exclusively via the URL hash or path (`/#admin` or `/admin`).

* **Email:** `admin@greenfield.edu.ph`
* **Password:** `Admin123!`

---

## 📦 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── atoms/          # Reusable buttons, badges, seals, search inputs
│   │   ├── molecules/      # Stat cards, project cards, achievement cards
│   │   ├── organisms/      # Header navbar, hero banners, footer
│   │   ├── templates/      # Main layout wrappers
│   │   └── pages/          # 5 Public pages + Admin Dashboard
│   ├── data/
│   │   └── mockData.js     # Configurable institutional seed data
│   ├── services/
│   │   └── apiClient.js    # API client
│   ├── App.jsx             # Main router and state manager
│   └── main.jsx            # Entry point
├── api/                    # Optional PHP backend & MySQL schema
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
