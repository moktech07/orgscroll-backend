# Deploy Backend to Render.com

## Steps to Deploy

### 1. Create GitHub Repository for Backend
```bash
cd /home/swiphy/test/clorgsc/backend
git remote add origin https://github.com/YOUR_USERNAME/orgscroll-backend.git
git branch -M main
git push -u origin main
```

### 2. Go to Render.com
- Visit https://render.com
- Click "New +" → "Web Service"
- Connect GitHub account
- Select `orgscroll-backend` repository
- Fill in:
  - **Name**: orgscroll-api
  - **Runtime**: Node
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `node dist/main.js`
  - **Region**: Choose closest to users
- Add environment variables (already in render.yaml)
- Click "Create Web Service"

### 3. Wait for Deployment
- Render will build and deploy automatically
- You'll get a URL like: `https://orgscroll-api.onrender.com`

### 4. Update App API URL
Once deployed, update `/orgscroll/src/lib/api/cardClient.ts`:
```typescript
const API_BASE_URL = 'https://orgscroll-api.onrender.com'; // Replace with your Render URL
```

### 5. Test
- The app will now fetch cards from the live API
- Progress will be synced to Supabase

## API Endpoints Available
- `GET /cards?exam=jee&class=11&chapter=goc` - Fetch cards
- `POST /progress/attempt` - Record card attempt
- `GET /progress/stats/:userId` - Get user stats
