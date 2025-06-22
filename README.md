# 🌊 HydroScribe - Intelligent Water Monitoring System

<div align="center">

![HydroScribe Banner](./public/picture1.png)

**Next-level water monitoring with AI-powered insights**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Bedrock-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![NVIDIA](https://img.shields.io/badge/NVIDIA-NIM-green?style=for-the-badge&logo=nvidia)](https://developer.nvidia.com/)

</div>

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [💻 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔧 Hardware Setup](#-hardware-setup)
- [🤖 AI Integration](#-ai-integration)
- [📱 Usage Guide](#-usage-guide)
- [🛠️ Development](#️-development)
- [📁 Project Structure](#-project-structure)
- [🌐 API Endpoints](#-api-endpoints)
- [🎨 UI Components](#-ui-components)
- [📊 Dashboard Features](#-dashboard-features)
- [🔐 Security](#-security)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Project Overview

HydroScribe is an intelligent water monitoring system that combines IoT hardware with cutting-edge AI to address critical global water challenges. The system provides real-time monitoring, predictive insights, and automated alerts for flood prevention, irrigation optimization, and water quality management.

### 🌍 Global Impact
- **2.2 billion people** lack access to safely managed drinking water
- **Cost Reduction**: 90% lower than traditional systems ($200-$500 vs $5,000-$15,000)
- **Real-time Monitoring**: 24/7 water level, temperature, pH tracking
- **AI-Powered**: Advanced prediction algorithms with multiple AI providers

### 🏆 Built for Amazon Hackathon 2025
This project demonstrates the integration of AWS services with modern web technologies to create a scalable, cost-effective water monitoring solution.

## ✨ Key Features

### 🔄 Real-time Monitoring
- **24/7 Data Collection**: Continuous sensor readings from multiple locations
- **Live Dashboard**: Real-time charts and visualizations
- **Instant Alerts**: Immediate notifications for critical conditions
- **Historical Tracking**: Long-term data storage and trend analysis

### 🤖 Multi-AI Provider Support
Choose from four powerful AI providers:

| Provider | Model | Specialization | Use Case |
|----------|-------|----------------|----------|
| 🟠 **AWS Bedrock** | Claude 3 Haiku | Enterprise-grade insights | Water management analysis |
| 🟢 **NVIDIA NIM** | Llama 3.1 Nemotron 70B | Advanced predictions | Flood prevention & forecasting |
| 🟣 **Mistral AI** | Mistral Large Latest | Water expertise | Irrigation optimization |
| 🔵 **Gemini AI** | Gemini 2.0 Flash | Comprehensive analysis | Quality assessment |

### 🌊 Water Management Features
- **Flood Prevention**: Early warning system with predictive algorithms
- **Irrigation Optimization**: Smart watering recommendations
- **Water Quality Analysis**: pH and temperature monitoring
- **Equipment Monitoring**: Predictive maintenance alerts

### 💬 Interactive AI Q&A
- Ask questions about water management in natural language
- Get contextual responses based on current sensor data
- Switch between AI models instantly
- Expert knowledge about system architecture and capabilities

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hardware      │    │   Web App       │    │   AI Services   │
│   (UDOO Board)  │────│   (Next.js)     │────│   (4 Providers) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ Sensors │             │Dashboard│             │ Insights│
    │ • Water │             │• Charts │             │• Q&A    │
    │ • Temp  │             │• Controls│             │• Alerts │
    │ • pH    │             │• Status │             │• Trends │
    └─────────┘             └─────────┘             └─────────┘
```

### Technology Stack

**Frontend:**
- **Next.js 15.3.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization

**Backend:**
- **Next.js API Routes** - Serverless functions
- **AWS IoT Core** - Device management
- **ThingSpeak** - IoT data platform
- **MQTT** - Real-time messaging

**Hardware:**
- **UDOO Dual/Quad Board** - Main microcontroller
- **Arduino IDE** - Hardware programming
- **Multiple Sensors** - Water, temperature, pH monitoring

**AI Integration:**
- **AWS Bedrock** - Claude 3 Haiku
- **NVIDIA NIM** - Llama 3.1 Nemotron 70B
- **Mistral AI** - Mistral Large Latest
- **Google Gemini** - Gemini 2.0 Flash

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- AWS Account (for Bedrock)
- API keys for AI services

### 1-Minute Setup

```bash
# Clone the repository
git clone https://github.com/aditya13504/hydroscribe-water-monitor.git
cd hydroscribe-water-monitor

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API keys to .env.local
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 💻 Installation

### Development Environment

1. **Clone Repository**
   ```bash
   git clone https://github.com/aditya13504/hydroscribe-water-monitor.git
   cd hydroscribe-water-monitor
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# ====== AI PROVIDERS ======

# AWS Bedrock (Required for AWS features)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here

# NVIDIA NIM (Your API key)
NVIDIA_API_KEY=your_nvidia_api_key_here

# Mistral AI (Provided - Ready to use)
MISTRAL_API_KEY=69jHjrY5o7VIYbSFZXz03qVhI88SbWyE

# Gemini AI (Provided - Ready to use)
GEMINI_API_KEY=AIzaSyDhiuOcnpPPL3MA5_3kYONh4hS9f6hnqRo

# ====== IOT DATA ======

# ThingSpeak (Optional - for hardware integration)
THINGSPEAK_API_KEY=your_thingspeak_key_here
THINGSPEAK_CHANNEL_ID=your_channel_id_here

# ====== APPLICATION ======

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### AWS Bedrock Setup

1. **Create AWS Account** and enable Bedrock service
2. **Request Model Access** for Claude 3 Haiku
3. **Create IAM User** with Bedrock permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
4. **Generate Access Keys** and add to `.env.local`

### NVIDIA NIM Setup

1. **Sign up** at [NVIDIA Developer](https://developer.nvidia.com/)
2. **Request API Access** for NIM services
3. **Generate API Key** and add to `.env.local`

## 🔧 Hardware Setup

### Required Components

| Component | Quantity | Purpose |
|-----------|----------|---------|
| UDOO Dual/Quad Board | 1 | Main microcontroller |
| Water Level Sensor | 1 | Water detection |
| Temperature Sensor (LM35) | 1 | Temperature monitoring |
| pH Sensor | 1 | Water quality |
| Breadboard & Jumper Wires | 1 set | Connections |
| Power Supply (5V) | 1 | Board power |
| WiFi Module (if not built-in) | 1 | Internet connectivity |

### Wiring Diagram

```
UDOO Board Connections:
┌─────────────────┐
│     UDOO        │
│                 │
│ D2  ────────────┼──── Water Level Sensor
│ A0  ────────────┼──── Temperature Sensor
│ A1  ────────────┼──── pH Sensor
│ GND ────────────┼──── Common Ground
│ 5V  ────────────┼──── Power Supply
└─────────────────┘
```

### Arduino Code Setup

1. **Install Arduino IDE**
2. **Add UDOO Board** to board manager
3. **Install Libraries**:
   ```
   - WiFi
   - ArduinoMqttClient
   - ArduinoJson
   ```
4. **Upload Code**: Use `hardware/aws_iot_integration.ino`
5. **Configure Network**: Update WiFi credentials in the code

### Pin Configuration

```cpp
// Pin definitions in arduino code
const int sensorPin = 2;     // Water level sensor
const int tempPin = A0;      // Temperature sensor  
const int phPin = A1;        // pH sensor
const int ledPin = 13;       // Status LED
```

### Hardware Assembly Steps

Detailed assembly instructions with 18 step-by-step images are available in the [Hardware Installation Guide](/hardware) section of the web application.

## 🤖 AI Integration

### Architecture Overview

```
User Question → AI Provider Selection → Context + Sensor Data → AI Response
     ↓              ↓                        ↓                    ↓
Dashboard      Model Dropdown         Real-time Data        Actionable Insight
```

### AI Provider Details

#### 🟠 AWS Bedrock (Claude 3 Haiku)
- **Strength**: Enterprise-grade water management insights
- **Use Cases**: General water analysis, safety recommendations
- **Setup**: Requires AWS account and Bedrock access
- **Cost**: ~$0.25 per 1M input tokens

#### 🟢 NVIDIA NIM (Llama 3.1 Nemotron 70B)
- **Strength**: Advanced flood prediction and forecasting
- **Use Cases**: Complex pattern analysis, risk assessment
- **Setup**: Requires NVIDIA Developer account
- **Cost**: Variable based on usage

#### 🟣 Mistral AI (Mistral Large Latest)
- **Strength**: Water management expertise and optimization
- **Use Cases**: Irrigation advice, efficiency optimization
- **Setup**: API key provided (ready to use)
- **Cost**: Included in project

#### 🔵 Gemini AI (Gemini 2.0 Flash)
- **Strength**: Comprehensive analysis and explanations
- **Use Cases**: Educational content, detailed explanations
- **Setup**: API key provided (ready to use)
- **Cost**: Included in project

### AI Integration Flow

1. **Data Collection**: Real-time sensor readings
2. **Context Building**: Add project knowledge and historical data
3. **AI Processing**: Send to selected AI provider
4. **Response Parsing**: Extract insights and recommendations
5. **UI Display**: Show formatted results to user

## 📱 Usage Guide

### Getting Started

1. **Choose Implementation Type**
   - **Hardware**: Full IoT setup with physical sensors
   - **Software**: Demo mode with simulated data

2. **Select Hosting Infrastructure**
   - **AWS Infrastructure**: Enterprise-grade hosting
   - **NVIDIA Infrastructure**: High-performance AI inference

3. **Access Dashboard**: Real-time monitoring interface

### Dashboard Navigation

#### Main Sections

**📊 Sensor Overview**
- Current water level status
- Temperature and pH readings
- Flow rate and battery status
- Signal strength indicators

**📈 Data Visualization**
- Real-time charts showing sensor trends
- Historical data comparison
- Customizable time ranges
- Export functionality

**🤖 AI Insights Panel**
- Model selection dropdown
- Auto-generated insights
- Confidence scores and severity levels
- Refresh and regenerate options

**💬 Interactive Q&A**
- Natural language question input
- Context-aware responses
- Chat history
- Model switching without page reload

#### Sample Questions to Ask AI

**Water Management:**
- "What's the current flood risk based on sensor data?"
- "How can I optimize irrigation for my crops?"
- "Should I be concerned about the pH levels?"

**System Operations:**
- "When should I perform maintenance on sensors?"
- "How does current data compare to historical patterns?"
- "What are the predictions for next week?"

**Educational:**
- "Explain how the HydroScribe system works"
- "What factors affect water quality?"
- "How do I interpret these sensor readings?"

### Hardware Installation Guide

The web application includes a comprehensive hardware installation guide with:

- **18 Step-by-step Images**: Visual assembly instructions
- **Zoom Modal**: Click any image to view in detail
- **Rotation Feature**: Rotate images for better viewing
- **Dark Mode Support**: Consistent experience across themes

Access via: Navigation Menu → Hardware Installation

## 🛠️ Development

### Project Structure

```
hydroscribe-water-monitor/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📄 layout.tsx          # Root layout with providers
│   │   ├── 📄 page.tsx            # Homepage with AI selection
│   │   ├── 📁 dashboard/          # Main dashboard
│   │   │   └── 📄 page.tsx        # Dashboard with charts & AI
│   │   ├── 📁 hardware/           # Hardware installation guide  
│   │   │   └── 📄 page.tsx        # Step-by-step instructions
│   │   └── 📁 api/                # API routes
│   │       ├── 📁 insights/       # AI provider endpoints
│   │       │   ├── 📁 aws/        # AWS Bedrock integration
│   │       │   ├── 📁 nvidia/     # NVIDIA NIM integration
│   │       │   ├── 📁 mistral/    # Mistral AI integration
│   │       │   └── 📁 gemini/     # Gemini AI integration
│   │       └── 📁 thingspeak/     # IoT data endpoint
│   ├── 📁 lib/                    # Utility libraries
│   │   ├── 📄 aws-bedrock.ts      # AWS service integration
│   │   ├── 📄 nvidia-ai.ts        # NVIDIA API client
│   │   ├── 📄 mistral-ai.ts       # Mistral API client
│   │   ├── 📄 gemini-ai.ts        # Gemini API client
│   │   ├── 📄 thingspeak.ts       # IoT data fetching
│   │   └── 📄 utils.ts            # Helper functions
│   ├── 📁 contexts/               # React contexts
│   │   └── 📄 DarkModeContext.tsx # Theme management
│   └── 📁 types/                  # TypeScript definitions
│       └── 📄 index.ts            # Global type definitions
├── 📁 hardware/                   # Arduino code
│   ├── 📄 aws_iot_integration.ino # Main hardware code
│   └── 📄 basic_water_monitor.ino # Basic sensor setup
├── 📁 docs/                       # Documentation
│   ├── 📄 AI_INTEGRATION_SUMMARY.md
│   ├── 📄 HACKATHON_PRESENTATION.md
│   ├── 📄 IMPACT_ASSESSMENT.md
│   └── 📄 NOVA_LITE_INTEGRATION.md
├── 📁 public/                     # Static assets
│   ├── 📄 picture1.png - picture18.png # Hardware images
│   └── 📄 *.svg                   # Icons and graphics
└── 📄 package.json                # Dependencies and scripts
```

### Key Dependencies

```json
{
  "dependencies": {
    "@aws-sdk/client-bedrock-runtime": "^3.830.0",
    "@aws-sdk/client-iot-data-plane": "^3.830.0", 
    "framer-motion": "^12.18.1",
    "lucide-react": "^0.522.0",
    "next": "15.3.4",
    "react": "^19.0.0",
    "recharts": "^2.15.4"
  }
}
```

### Development Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server  
npm run start

# Run linting
npm run lint

# Test Nova Lite configuration
npm run check-nova

# Test Nova Lite integration
npm run test-nova
```

### Code Style Guidelines

**TypeScript:**
- Use strict typing for all functions and components
- Prefer interfaces over types for object definitions
- Use proper error handling with try-catch blocks

**React Components:**
- Use functional components with hooks
- Implement proper prop typing
- Use React.memo for performance optimization when needed

**Styling:**
- Use Tailwind CSS utility classes
- Implement dark mode support consistently
- Use Framer Motion for animations

**API Design:**
- RESTful endpoints with proper HTTP status codes
- Consistent error response format
- Input validation and sanitization

## 📁 Project Structure Details

### `/src/app/` - Next.js App Router

**`layout.tsx`**: Root layout with global providers
- Dark mode context provider
- Global metadata and SEO
- Font and theme configuration

**`page.tsx`**: Homepage with provider selection
- Hardware vs Software options
- AWS vs NVIDIA hosting choice
- Feature showcase and navigation

**`dashboard/page.tsx`**: Main monitoring interface
- Real-time sensor data visualization
- AI insights panel with model selection
- Interactive Q&A chat interface
- Responsive charts and controls

**`hardware/page.tsx`**: Installation guide
- 18 step-by-step images with zoom modal
- Assembly instructions and wiring diagrams
- Pin configurations and code setup

**`api/insights/`**: AI provider endpoints
- Standardized request/response format
- Error handling and validation
- Context-aware prompt generation

### `/src/lib/` - Service Libraries

**AI Service Pattern:**
```typescript
export class AIService {
  async generateWaterInsights(data: WaterSensorData[]): Promise<InsightResponse>
  async generateQAResponse(question: string, context?: WaterSensorData[]): Promise<QAResponse>
  private createInsightPrompt(data: WaterSensorData[]): string
  private createContextPrompt(question: string, data?: WaterSensorData[]): string
}
```

**`thingspeak.ts`**: IoT data integration
- Real-time data fetching from ThingSpeak
- Data transformation and validation
- Error handling for network issues

### `/src/types/index.ts` - Type Definitions

```typescript
interface WaterSensorData {
  device_id: string;
  water_level: string;
  temperature: number;
  ph_level: number;
  flow_rate: number;
  timestamp: string;
  battery_level: number;
  signal_strength: number;
}

interface InsightResponse {
  insights: Array<{
    message: string;
    severity: 'info' | 'warning' | 'critical';
    type: 'flood_warning' | 'irrigation_advice' | 'maintenance_alert' | 'quality_concern';
    confidence_score: number;
  }>;
}
```

## 🌐 API Endpoints

### AI Insights Endpoints

| Endpoint | Method | Purpose | Payload |
|----------|---------|---------|---------|
| `/api/insights/aws` | POST | AWS Bedrock insights | `{ sensorData, question? }` |
| `/api/insights/nvidia` | POST | NVIDIA NIM analysis | `{ sensorData, question? }` |
| `/api/insights/mistral` | POST | Mistral AI insights | `{ sensorData, question? }` |
| `/api/insights/gemini` | POST | Gemini AI analysis | `{ sensorData, question? }` |

### Data Endpoints

| Endpoint | Method | Purpose | Response |
|----------|---------|---------|----------|
| `/api/thingspeak` | GET | Fetch sensor data | `WaterSensorData[]` |

### Request/Response Format

**Request Body:**
```json
{
  "sensorData": [
    {
      "device_id": "hydro_001",
      "water_level": "NORMAL", 
      "temperature": 23.5,
      "ph_level": 7.2,
      "flow_rate": 45.3,
      "timestamp": "2024-01-15T10:30:00Z",
      "battery_level": 85.5,
      "signal_strength": -45
    }
  ],
  "question": "What's the flood risk?" // Optional for Q&A
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "message": "Water levels are within normal parameters...",
        "severity": "info",
        "type": "flood_warning", 
        "confidence_score": 0.92
      }
    ]
  }
}
```

## 🎨 UI Components

### Design System

**Color Palette:**
- Primary: Blue (#3B82F6)
- Success: Green (#22C55E) 
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Dark Mode: Gray scale (#1F2937 - #F9FAFB)

**Typography:**
- Font Family: Inter
- Headings: Bold, large sizes
- Body: Medium weight, readable sizes
- Code: Monospace font

### Component Architecture

**Layout Components:**
- `Header`: Navigation and theme toggle
- `Sidebar`: Navigation and quick actions
- `Footer`: Links and information

**Data Components:**
- `SensorCard`: Individual sensor display
- `ChartContainer`: Recharts wrapper with theming
- `DataTable`: Sortable, filterable data display

**Interactive Components:**
- `AIModelSelector`: Dropdown for AI provider selection
- `QuestionInput`: Natural language Q&A interface
- `ZoomModal`: Image zoom with controls
- `LoadingSpinner`: Consistent loading states

**Animation Components:**
- `FadeIn`: Smooth entrance animations
- `SlideUp`: Upward slide transitions
- `Stagger`: Sequential animation timing

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px
- Large: > 1280px

**Mobile Adaptations:**
- Collapsible navigation
- Stacked chart layouts
- Touch-optimized controls
- Reduced animation complexity

## 📊 Dashboard Features

### Real-time Monitoring

**Sensor Status Cards:**
- Current readings with trend indicators
- Color-coded severity levels
- Last update timestamps
- Connection status indicators

**Interactive Charts:**
- Line charts for time-series data
- Bar charts for comparisons
- Gauge charts for current levels
- Customizable time ranges (1h, 6h, 24h, 7d)

**Data Refresh:**
- Auto-refresh every 30 seconds
- Manual refresh controls
- Real-time WebSocket updates (when available)
- Offline status detection

### AI Insights Panel

**Model Selection:**
- Dropdown with 4 AI providers
- Provider descriptions and specializations
- Real-time model switching
- Performance indicators

**Insight Display:**
- Structured insight cards
- Severity-based color coding
- Confidence score indicators
- Timestamp and refresh controls

**Interactive Q&A:**
- Natural language input
- Context-aware responses
- Chat history preservation
- Copy/share functionality

### Alert System

**Alert Types:**
- Critical: Immediate attention required
- Warning: Potential issues
- Info: General notifications
- Maintenance: System updates

**Notification Methods:**
- In-app notifications
- Browser notifications (with permission)
- Visual indicators on dashboard
- Audio alerts for critical conditions

## 🔐 Security

### API Security

**Authentication:**
- API key validation for all AI services
- Rate limiting to prevent abuse
- Input sanitization and validation
- CORS configuration for allowed origins

**Data Protection:**
- Environment variable isolation
- No sensitive data in client-side code
- Secure storage of API keys
- Regular key rotation recommendations

### Infrastructure Security

**AWS Security:**
- IAM roles with minimal permissions
- VPC configuration for network isolation
- CloudTrail logging for audit trails
- Encryption in transit and at rest

**Application Security:**
- Content Security Policy (CSP) headers
- HTTPS enforcement in production
- XSS protection measures
- Input validation on all endpoints

### Best Practices

**Development:**
```bash
# Never commit secrets
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore

# Use environment variables
const apiKey = process.env.MISTRAL_API_KEY;

# Validate inputs
if (!apiKey) {
  throw new Error('API key not configured');
}
```

**Production:**
- Use secure environment variable management
- Enable logging and monitoring
- Regular security updates
- Backup and disaster recovery plans

## 🚨 Troubleshooting

### Common Issues

#### 1. AI Provider Connection Errors

**AWS Bedrock "Access Denied":**
```bash
# Check AWS credentials
aws configure list

# Verify Bedrock permissions
aws bedrock list-foundation-models --region us-east-1

# Solution: Update IAM permissions
```

**NVIDIA API "Unauthorized":**
```bash
# Check API key in environment
echo $NVIDIA_API_KEY

# Solution: Verify API key is valid and active
```

#### 2. Build Errors

**TypeScript Errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies  
rm -rf node_modules package-lock.json
npm install

# Check TypeScript configuration
npx tsc --noEmit
```

**Missing Dependencies:**
```bash
# Install specific missing packages
npm install @aws-sdk/client-bedrock-runtime
npm install framer-motion lucide-react

# Or reinstall all
npm install
```

#### 3. Hardware Connection Issues

**Sensor Not Reading:**
- Check wiring connections
- Verify power supply (5V)
- Test individual sensors
- Check pin configurations in code

**WiFi Connection Failed:**
- Verify network credentials
- Check WiFi signal strength
- Test with mobile hotspot
- Update WiFi library

#### 4. Dashboard Data Issues

**No Data Displayed:**
- Check ThingSpeak API configuration
- Verify network connectivity
- Test API endpoints manually
- Check browser console for errors

**Charts Not Loading:**
- Verify Recharts installation
- Check data format compatibility
- Test with sample data
- Check responsive design settings

### Debug Commands

```bash
# Test environment configuration
npm run check-nova

# Test specific AI integration
npm run test-nova

# Build and check for errors
npm run build

# Start with debug logging
DEBUG=* npm run dev
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `AI_001` | Provider authentication failed | Check API keys |
| `AI_002` | Rate limit exceeded | Implement request throttling |
| `DATA_001` | Sensor data validation failed | Check data format |
| `DATA_002` | ThingSpeak connection timeout | Verify network/API |
| `BUILD_001` | TypeScript compilation error | Fix type errors |
| `BUILD_002` | Missing environment variables | Check .env.local |

### Performance Issues

**Slow Dashboard Loading:**
- Enable image optimization
- Implement lazy loading
- Use React.memo for expensive components
- Optimize chart rendering

**High Memory Usage:**
- Check for memory leaks in useEffect
- Limit chart data points
- Implement data pagination
- Clear old data from state

## 🤝 Contributing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/aditya13504/hydroscribe-water-monitor.git
   cd hydroscribe-water-monitor
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

4. **Submit Pull Request**
   - Describe changes clearly
   - Include screenshots for UI changes
   - Reference related issues

### Contribution Guidelines

**Code Standards:**
- TypeScript for all new code
- ESLint and Prettier configuration
- Meaningful commit messages
- Component documentation

**Testing:**
- Unit tests for utility functions
- Integration tests for API endpoints
- Manual testing for UI components
- Hardware testing for Arduino code

**Documentation:**
- Update README for new features
- Add inline code comments
- Create API documentation
- Include usage examples

### Areas for Contribution

- **AI Integration**: New AI providers or models
- **Sensor Support**: Additional hardware sensors
- **Visualization**: New chart types or dashboards
- **Mobile App**: React Native companion app
- **Testing**: Automated testing suite
- **Localization**: Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Credits

**Development Team:**
- HydroScribe Team - Core development
- Amazon Hackathon 2025 - Project inspiration
- Open source community - Dependencies and tools

**AI Providers:**
- AWS Bedrock - Claude 3 Haiku integration
- NVIDIA NIM - Llama 3.1 Nemotron 70B
- Mistral AI - Water management expertise
- Google Gemini - Comprehensive analysis

**Hardware Inspiration:**
- Arduino Community - Code examples and libraries
- UDOO Community - Board support and documentation
- IoT Community - Sensor integration patterns

---

## 🚀 Get Started Now

Ready to revolutionize water monitoring? Follow the [Quick Start](#-quick-start) guide and have HydroScribe running in minutes!

For questions or support, create an issue on GitHub or contact the development team.

**Happy Monitoring! 🌊**

---

<div align="center">

**Built with ❤️ for Amazon Hackathon 2025**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/your-username/hydroscribe-water-monitor)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>
