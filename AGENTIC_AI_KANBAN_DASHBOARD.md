# Agentic AI Kanban Dashboard
Real-time visualization of parallel Agentic AI workflows for TikTok Affiliate and Digital Products streams

## Dashboard Overview
This dashboard provides real-time monitoring of Agentic AI subagents working concurrently on both revenue streams using free, OpenAPI-compatible endpoints.

## System Architecture
```
┌─────────────────────────────┐    ┌─────────────────────────────┐
│   TikTok Affiliate Stream   │    │   Digital Products Stream   │
│    (Branch A)               │    │    (Branch B)               │
└─────────────┬───────────────┘    └─────────────┬───────────────┘
              │                                  │
┌─────────────▼───────────────┐    ┌─────────────▼───────────────┐
│  Agentic AI Orchestrator    │    │  Agentic AI Orchestrator    │
│       (NVIDIA Nemotron)     │    │       (NVIDIA Nemotron)     │
└─────────────┬───────────────┘    └─────────────┬───────────────┘
              │                                  │
┌─────────────▼─────────────┐┌─────────────▼─────────────┐┌─────────────▼─────────────┐┌─────────────▼─────────────┐
│ Research Subagent         ││ Content Subagent          ││ Optimization Subagent     ││ Analytics Subagent        │
│                           ││                           ││                           ││                           │
└───────────────────────────┘└───────────────────────────┘└───────────────────────────┘└───────────────────────────┘
              │                                  │              │                                  │
┌─────────────▼─────────────┐┌─────────────▼─────────────┐┌─────────────▼─────────────┐┌─────────────▼─────────────┐
│ TikTok-Specific Tasks     ││ Digital Product Tasks     ││ TikTok-Specific Tasks     ││ Digital Product Tasks     │
│                           ││                           ││                           ││                           │
└───────────────────────────┘└───────────────────────────┘└───────────────────────────┘└───────────────────────────┘
              │                                  │              │                                  │
┌─────────────▼─────────────┐┌─────────────▼─────────────┐┌─────────────▼─────────────┐┌─────────────▼─────────────┐
│ Kanban Board Column:      ││ Kanban Board Column:      ││ Kanban Board Column:      ││ Kanban Board Column:      │
│ [Backlog] [In Progress]   ││ [Backlog] [In Progress]   ││ [Review] [Done]           ││ [Review] [Done]           │
│ [Review] [Done]           ││ [Review] [Done]           ││                           ││                           │
└───────────────────────────┘└───────────────────────────┘└───────────────────────────┘└───────────────────────────┘
```

## Free/OpenAPI-Compatible Endpoints Used

### NVIDIA AI Endpoints (Free Tier)
- **Text Generation**: `https://ai.api.nvidia.com/v1/nim/llama-3.1-nemotron-70b-instruct`
- **Embedding**: `https://ai.api.nvidia.com/v1/retrieval/nvidia/embedding`
- **Vision**: `https://ai.api.nvidia.com/v1/vlm/nvidia/neva-22b`
- **Audio**: `https://ai.api.nvidia.com/v1/audio/nvidia/canary-1b`

### Other Free APIs Integrated
- **Google Sheets API**: Product research tracking & automation
- **Apify API**: Automated TikTok/Shopify product scraping
- **Make.com Webhooks**: Workflow automation between services
- **GitHub Actions**: CI/CD for workflow updates
- **Unsplash API**: Free image sourcing for content creation
- **Pexels API**: Free video sourcing for TikTok content

## Kanban Board Structure

### TikTok Affiliate Stream (Branch A)
**Columns:**
1. **Backlog** - Product ideas, content concepts, campaign opportunities
2. **In Progress** - Active research, video creation, campaign setup
3. **Review** - Awaiting performance data, optimization needed
4. **Done** - Completed campaigns, archived learnings

**Subagent Responsibilities:**
- **Research Subagent**: 
  - Scrapes TikTok Shop for trending products (Apify + Google Sheets)
  - Analyzes competitor content performance
  - Identifies high-commission products (>20%)
  - Tracks viral sounds/hashtags (TikTok Creative Center)
  
- **Content Subagent**:
  - Generates video scripts using Nemotron-70b
  - Creates caption variations for A/B testing
  - Suggests visual templates based on top-performing content
  - Optimizes posting times based on audience analytics
  
- **Optimization Subagent**:
  - Adjusts bidding strategies based on EPM (Earnings Per Mille)
  - Rotates link targets in bio based on performance
  - Tests different CTAs in video descriptions
  - Manages comment-to-DM automation flow
  
- **Analytics Subagent**:
  - Calculates real-time EPM and conversion rates
  - Tracks ROI by video/product/campaign
  - Generates weekly performance reports
  - Alerts on performance thresholds (EPM < $5)

### Digital Products Stream (Branch B)
**Columns:**
1. **Backlog** - Product niches, lead magnet ideas, funnel concepts
2. **In Progress** - Product creation, lead magnet development, funnel setup
3. **Review** - Awaiting sales data, optimization needed
4. **Done** - Completed products, automated funnels

**Subagent Responsibilities:**
- **Research Subagent**:
  - Validates niche demand using Google Trends + keyword tools
  - Analyzes competitor products on Gumroad/Etsy
  - Identifies content gaps in target audiences
  - Tracks pricing psychology in digital products
  
- **Content Subagent**:
  - Generates product outlines using Nemotron-70b
  - Creates exercise variations and examples
  - designs printable layouts using AI-assisted tools
  - writes sales copy and email sequences
  
- **Optimization Subagent**:
  - A/B tests product titles and descriptions
  - Optimizes upsell sequence based on cart data
  - Adjusts pricing based on conversion velocity
  - Tests different lead magnet formats
  
- **Analytics Subagent**:
  - Tracks LTV (Lifetime Value) by product/niche
  - Measures funnel conversion rates at each step
  - Calculates ROI on advertising spend
  - Identifies churn points in customer journey

## Real-Time Data Flow

### Data Input Sources
1. **TikTok API** (via Apify proxy) - Video performance, comments, shares
2. **Google Analytics** - Website traffic, conversion funnels
3. **Email Platforms** (ConvertKit) - Open rates, click-through, unsubscribes
4. **Payment Processors** (Gumroad/Stripe) - Sales, refunds, chargebacks
5. **Social Platforms** - Engagement metrics, follower growth
6. **Ad Platforms** - Ad spend, impressions, clicks, conversions

### Data Processing Pipeline
```
Raw Data Ingestion
        ↓
Data Cleaning & Normalization (Python microservices)
        ↓
Feature Engineering (Agentic AI preprocessing)
        ↓
Subagent-Specific Analysis (Nemotron-70b fine-tuned prompts)
        ↓
Decision Making (Rule-based + ML hybrid)
        ↓
Action Execution (API calls, content generation, workflow triggers)
        ↓
Feedback Logging (Event tracking to /api/events endpoint)
        ↓
Dashboard Update (WebSocket broadcast every 5s)
```

## Key Metrics Displayed

### TikTok Affiliate Stream
- **EPM (Earnings Per Mille Views)**: Real-time calculation
- **Video CTR to Bio Link**: Percentage of viewers clicking link
- **Commission Per Video**: Average earnings per content piece
- **Active Campaigns**: Count of currently running promotions
- **Link Rotation Efficiency**: Performance of bio link targets

### Digital Products Stream
- **Daily Sales Velocity**: Units sold per day by product
- **Funnel Conversion Rate**: Visitor → lead → customer percentage
- **Average Order Value (AOV)**: Including upsells/order bumps
- **Customer Acquisition Cost (CAC)**: Marketing spend per customer
- **Lead Magnet Performance**: Conversion rate visitor → email

### Synergy Metrics
- **Cross-Stream Attribution**: % product sales from TikTok vs email
- **Affiliate-to-Product Conversion**: TikTok followers → digital product buyers
- **Content Repurposing Efficiency**: TikTok videos → product promo assets
- **Reinvestment Ratio**: % affiliate profits allocated to product development

## Implementation Notes

### API Key Management (Free Tiers)
- **NVIDIA**: Sign up at ai.nvidia.com for free API credits
- **Google Sheets**: Use service account with limited scope
- **Apify**: Free tier provides 10,000 results/month
- **Make.com**: Free tier allows 1,000 operations/month
- **GitHub Actions**: Free for public repositories
- **Unsplash/Pexels**: Free API keys with attribution

### Rate Limiting & Quotas
- All subagents implement exponential backoff
- Request queuing during peak usage periods
- Priority-based processing (time-sensitive > batch jobs)
- Daily/weekly quota monitoring with alerts

### Error Handling & Recovery
- Circuit breaker pattern for failing external APIs
- Automatic fallback to cached data when possible
- Dead letter queue for failed workflow items
- Self-healing restart mechanisms for crashed subagents

## Deployment Instructions

### Local Development
1. Set up free API keys in `.env` file:
   ```
   NVIDIA_API_KEY=your_nvidia_key_here
   GOOGLE_SHEETS_CREDENTIALS=path/to/credentials.json
   APIFY_TOKEN=your_apify_token
   MAKECOM_WEBHOOK_URL=your_make_webhook_url
   ```
2. Start monitoring service:
   ```bash
   npm run monitor:dashboard
   ```
3. Access dashboard at `http://localhost:3000/dashboard`

### Docker Deployment
Add to `docker-compose.yml`:
```yaml
services:
  dashboard-monitor:
    build: .
    ports:
      - "3001:3001"  # Dedicated dashboard port
    environment:
      - NVIDIA_API_KEY=${NVIDIA_API_KEY}
      - GOOGLE_SHEETS_CREDENTIALS=/app/keys/google-sheets.json
      - APIFY_TOKEN=${APIFY_TOKEN}
      - MAKECOM_WEBHOOK_URL=${MAKECOM_WEBHOOK_URL}
    volumes:
      - ./keys:/app/keys:ro
      - ./data:/app/data
    restart: unless-stopped
```

### Kubernetes Deployment
Create `k8s/dashboard.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agentic-dashboard
  labels:
    app: agentic-dashboard
spec:
  replicas: 2
  selector:
    matchLabels:
      app: agentic-dashboard
  template:
    metadata:
      labels:
        app: agentic-dashboard
    spec:
      containers:
      - name: dashboard
        image: revenue-engine-platform:latest
        ports:
        - containerPort: 3001
        env:
        - name: NVIDIA_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: nvidia-key
        # ... other env vars from secret
      resources:
        requests:
          memory: "256Mi"
          cpu: "250m"
        limits:
          memory: "512Mi"
          cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: agentic-dashboard-svc
spec:
  selector:
    app: agentic-dashboard
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: LoadBalancer
```

## Usage Guidelines

### Monitoring Best Practices
1. **Daily Review** (5 minutes): Check EPM trends and alert thresholds
2. **Weekly Deep Dive** (30 minutes): Analyze subagent performance and optimization opportunities
3. **Monthly Strategy** (2 hours): Review cross-stream synergies and reinvestment allocations
4. **Quarterly Planning** (4 hours): Adjust resource allocation based on ROI trends

### Alert Thresholds (Customizable)
- **TikTok Stream**: EPM < $3 for 3 consecutive days → Pause underperforming content
- **Digital Stream**: Conversion rate < 2% for lead magnet → Test new offer
- **Synergy**: <10% product sales from TikTok → Improve content-to-product funnel
- **System Health**: >80% API error rate → Check key validity and quota usage

### Scaling Considerations
- **Horizontal**: Add more Orchestrator instances for parallel niche processing
- **Vertical**: Increase subagent complexity for high-value opportunities
- **Geographic**: Deploy region-specific instances for local market optimization
- **Temporal**: Schedule resource-intensive tasks during off-peak hours

## Integration with Revenue Engine Platform

### API Endpoints Utilized
- `GET /api/agents` - Provides baseline agent performance data
- `POST /api/events` - Logs all subagent decisions and actions
- `GET /api/stats` - Supplies revenue and conversion baseline metrics
- `WebSocket /` - Receives real-time updates for dashboard visualization

### Data Enrichment
The Agentic AI dashboard enhances the base platform by:
1. Adding predictive analytics to historical data
2. Providing autonomous decision-making capabilities
3. Enabling cross-stream optimization opportunities
4. Reducing manual monitoring overhead by 80%+
5. Creating self-improving workflows through reinforcement learning

## Next Steps for Implementation

1. **Week 1 Foundation**:
   - Obtain free API keys from NVIDIA, Google, Apify, Make.com
   - Create `.env` template with required variables
   - Set up basic monitoring service in `src/services/dashboard.service.ts`
   - Create initial Kanban board state in database/JSON storage

2. **Week 2 Activation**:
   - Implement Research Subagents for both streams
   - Connect to free APIs and begin data collection
   - Establish baseline metrics for optimization
   - Create first-generation content/assets

3. **Week 3 Optimization**:
   - Deploy Optimization Subagents with initial rules
   - Begin A/B testing based on collected data
   - Implement feedback loops for continuous improvement
   - Set up alerting thresholds based on baseline performance

4. **Week 4 Scale**:
   - Add Analytics Subagents for predictive insights
   - Implement cross-stream synergy detection
   - Prepare for horizontal scaling based on initial ROI
   - Document SOPs for subagent maintenance and updates

This dashboard transforms the Revenue Engine Platform from a reactive system to a proactive, self-optimizing revenue generation engine where Agentic AI subagents work continuously to identify, execute, and optimize opportunities across both TikTok Affiliate and Digital Products streams.
