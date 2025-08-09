# BodhiBuddy - Buddhist Explorer App

A personalized Buddhist learning and practice app built with Next.js 15, featuring progress tracking and content management.

## 🧘‍♀️ Features

- **Learning Hub**: Curated books, videos, and podcasts
- **Practice Lab**: Meditation timer and guided practices  
- **Integration & Reflection**: Journal and community links
- **Progress Tracking**: Mark content as complete and track your journey
- **Admin Panel**: Manage all content links with CRUD operations

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Visit:** http://localhost:3000

## 🔐 Admin Access

- **URL:** `/admin`
- **Default Password:** `admin`
- **Custom Password:** Set `ADMIN_PASSWORD` in `.env.local`

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/             # Utilities and data store
└── types.ts         # TypeScript definitions

data/
└── content.json     # Content and progress storage
```

## 🌟 Key Features

### Progress Tracking
- Visual checkboxes on all content cards
- Real-time progress updates
- Category-specific completion stats
- Overall progress dashboard on home page

### Content Management
- Add/edit/delete links via admin panel
- Categories: reading, video, audio, guided, podcast
- Responsive grid layouts
- Search and filter capabilities

### Meditation Tools
- Built-in meditation timer
- Preset durations (5m, 20m)
- Guided meditation library
- Personal reflection journal

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Storage:** JSON file-based
- **Authentication:** Simple cookie-based admin auth

## 📦 Deployment

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Set environment variables if needed

### Environment Variables
```bash
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_BASE_URL=https://your-domain.netlify.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own Buddhist learning journey!

---

Built with 🧘‍♀️ for mindful learning and practice.
