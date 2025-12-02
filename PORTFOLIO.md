# AI2Code - Portfolio Entry

## 🔗 Links
- **Live Demo**: https://ai-2-code.vercel.app/
- **GitHub Repository**: https://github.com/nagendracse24/AI2Code
- **Backend API**: https://ai2code.onrender.com/health

---

## 📖 Project Overview

**AI2Code** is an AI-powered design-to-code automation tool that converts Figma designs into production-ready React + TailwindCSS components. Built to showcase full-stack development skills, AI integration, and modern deployment practices.

### Problem Statement
Designers create beautiful UI mockups in Figma, but developers spend hours manually translating them into code. This manual process is error-prone, time-consuming, and doesn't scale for large projects.

### Solution
AI2Code bridges the design-development gap by:
- Fetching design data directly from Figma's API
- Normalizing the design structure into an LLM-friendly format
- Using OpenAI to generate clean, accessible React components
- Providing live preview, history tracking, and one-click downloads

---

## 🎯 Key Features

### 1. **Figma API Integration**
- Real-time fetching of design nodes and screenshots
- Automatic parsing of layouts, typography, and component hierarchies
- Supports both demo mode (no credentials) and live mode (with Figma token)

### 2. **AI-Powered Code Generation**
- OpenAI GPT integration for intelligent component creation
- Context-aware prompts with design constraints and best practices
- Generates TypeScript + React + TailwindCSS code

### 3. **Live Component Preview**
- In-browser rendering using react-live
- Side-by-side comparison of original design and generated code
- Real-time validation of generated components

### 4. **Observable Pipeline**
- Step-by-step timeline showing each generation stage
- Transparent LLM prompts for debugging and improvement
- Detailed metadata and performance metrics

### 5. **Generation History**
- localStorage-based session tracking
- Restore previous generations
- Compare multiple runs

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Preview**: react-live for code rendering
- **Deployment**: Vercel (auto-deploy on push)

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **APIs**: Figma REST API, OpenAI Chat Completions
- **Deployment**: Render (free tier with auto-scaling)

### Infrastructure
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel + Render auto-deploy
- **Environment Management**: dotenv
- **CORS**: Production-ready cross-origin configuration

---

## 💡 Technical Highlights

### 1. **Design Normalization**
Implemented a custom parser that converts Figma's complex JSON structure into a simplified schema optimized for LLM consumption:
```typescript
{
  id, name, type, boundingBox, text, childCount
}
```

### 2. **Prompt Engineering**
Crafted system prompts that guide the LLM to:
- Use semantic HTML and accessible patterns
- Follow React + TypeScript best practices
- Generate Tailwind classes for styling
- Maintain component modularity

### 3. **Production-Ready Architecture**
- Separation of concerns (services, routes, utilities)
- Error handling with graceful fallbacks
- Environment-based configuration
- CORS security for cross-origin requests

### 4. **Performance Optimization**
- Parallel API calls (Figma node + screenshot)
- Client-side caching with localStorage
- Lazy loading and code splitting

---

## 📊 Impact & Metrics

- **Time Savings**: Reduces design-to-code time from hours to seconds
- **Code Quality**: Generates accessible, semantic HTML with TypeScript types
- **Scalability**: Handles complex multi-component layouts
- **User Experience**: Fully responsive, futuristic UI with real-time feedback

---

## 🚀 Deployment

### Live URLs
- **Production Frontend**: https://ai-2-code.vercel.app/
- **Production API**: https://ai2code.onrender.com/

### Deployment Pipeline
1. Developer pushes to `main` branch
2. GitHub triggers webhooks to Vercel and Render
3. Both platforms build and deploy automatically
4. Zero-downtime rollout with health checks

---

## 🎓 Skills Demonstrated

- **Full-Stack Development**: React, Node.js, TypeScript, Express
- **API Integration**: Figma REST API, OpenAI GPT API
- **Cloud Deployment**: Vercel, Render, environment management
- **UI/UX Design**: Modern, accessible, responsive interfaces
- **AI/ML Integration**: Prompt engineering, LLM orchestration
- **DevOps**: CI/CD, git workflows, production deployment

---

## 📝 How to Use (For Recruiters/Reviewers)

### Try the Demo
1. Visit https://ai-2-code.vercel.app/
2. Use the pre-filled sample values (or paste your own Figma URL)
3. Click "Generate component"
4. Explore the tabs: Baseline stub, AI draft, Live preview
5. View the generation history
6. Download the generated code

### Run Locally
```bash
# Clone the repository
git clone https://github.com/nagendracse24/AI2Code.git

# Backend setup
cd backend
npm install
cp env.example .env
# Add your API keys to .env
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Enhancements

- [ ] Multi-component export (full page generation)
- [ ] Style extraction from Figma (colors, fonts, spacing)
- [ ] Component library integration (shadcn/ui, Material-UI)
- [ ] Real-time collaboration features
- [ ] Advanced evaluation metrics (code quality, accessibility scores)
- [ ] Plugin for Figma (generate directly in design tool)

---

## 📧 Contact

**Nagendra Singh**  
Software Engineer | AI + Full-Stack Developer

- **Email**: nagendracse24@gmail.com
- **GitHub**: [@nagendracse24](https://github.com/nagendracse24)
- **LinkedIn**: [Add your LinkedIn URL]
- **Portfolio**: [Add your portfolio URL]

---

## 📄 License

MIT License - Open source and available for educational purposes.

---

**Built with ❤️ by Nagendra Singh**

