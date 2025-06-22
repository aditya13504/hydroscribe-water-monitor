# Copilot Instructions for HydroScribe Water Monitoring System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
HydroScribe is a comprehensive water monitoring system built for the Amazon hackathon, combining IoT hardware integration with advanced AI services for real-time water level monitoring and intelligent insights.

## Key Technologies
- **Frontend**: Next.js 15+ with TypeScript, Tailwind CSS, App Router
- **AI Services**: AWS Bedrock, Amazon SageMaker, NVIDIA NIM APIs
- **IoT Integration**: AWS IoT Core, ThingSpeak API
- **Hardware**: UDOO Dual/Quad board, soil moisture sensors
- **Real-time Communication**: WebSockets, MQTT

## Development Guidelines
1. **AWS Integration**: Always prioritize AWS services (Bedrock, IoT Core, SageMaker) for AI and cloud functionality
2. **NVIDIA Services**: Integrate NVIDIA NIM APIs for advanced AI processing where applicable
3. **TypeScript**: Use strict TypeScript typing throughout the application
4. **Component Architecture**: Follow React best practices with reusable components
5. **Responsive Design**: Ensure mobile-first responsive design using Tailwind CSS
6. **Real-time Data**: Implement real-time data visualization and monitoring
7. **Hardware Integration**: Support both hardware and software-only modes
8. **Security**: Implement proper API key management and secure data transmission

## Project Structure
- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and API integrations
- `/src/types` - TypeScript type definitions
- `/hardware` - Arduino/UDOO board code and documentation
- `/docs` - Project documentation and setup guides

## Coding Standards
- Use functional components with hooks
- Implement proper error handling and loading states
- Follow accessibility guidelines (WCAG 2.1)
- Use semantic HTML and proper ARIA labels
- Implement proper SEO meta tags
- Use environment variables for sensitive configuration

## API Integration Patterns
- Implement proper error handling for all external API calls
- Use React Query or SWR for data fetching and caching
- Implement retry logic for critical operations
- Use proper TypeScript interfaces for API responses
