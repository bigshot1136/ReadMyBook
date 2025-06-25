# ReadMyBook - Personalized Children's Story Platform

## Overview

ReadMyBook is a full-stack web application that creates personalized children's stories using AI technology. The platform offers three main story creation modes: Minor Tweaks (template customization), Custom Stories (fully AI-generated), and a Ready-Made Shop (pre-made stories for purchase). Built with modern web technologies and integrated with OpenAI for story generation and DALL-E for illustrations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite for build tooling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: OpenID Connect (OIDC) via Replit Auth
- **Session Management**: Express sessions with PostgreSQL store

### AI Integration
- **Story Generation**: OpenAI GPT-4o for content creation
- **Image Generation**: DALL-E for story illustrations
- **Content Processing**: Structured JSON responses for consistent story formatting

## Key Components

### Database Schema
- **Users Table**: Manages user profiles and subscription tiers (required for Replit Auth)
- **Sessions Table**: Handles session storage (required for Replit Auth)
- **Story Templates**: Pre-built story frameworks with customizable placeholders
- **Stories**: User-generated and customized stories with metadata
- **Orders**: E-commerce functionality for story purchases

### Authentication System
- **Provider**: Replit OIDC integration
- **Session Management**: PostgreSQL-backed sessions with 7-day TTL
- **User Management**: Automatic user creation/updates on authentication

### Story Creation Pipeline
1. **Template Mode**: Users select templates and customize character names
2. **Custom Mode**: Multi-step form for complete story customization
3. **AI Processing**: OpenAI generates content and illustration prompts
4. **Image Generation**: DALL-E creates custom illustrations
5. **Storage**: Complete stories saved with metadata and illustrations

### File Upload System
- **Handler**: Multer with memory storage
- **Constraints**: 5MB limit, image files only
- **Use Case**: Character photo uploads for personalization

## Data Flow

1. **User Authentication**: OIDC flow creates/updates user records
2. **Story Request**: Frontend forms collect user preferences
3. **AI Generation**: Backend processes requests through OpenAI API
4. **Content Storage**: Generated stories saved to PostgreSQL
5. **Media Handling**: Images processed and stored appropriately
6. **User Interface**: Stories displayed with rich formatting and illustrations

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Neon serverless driver
- **AI Services**: OpenAI API (GPT-4o and DALL-E)
- **Authentication**: Replit OIDC provider
- **UI Framework**: Radix UI component primitives
- **Development**: Replit-specific tooling and plugins

### Build and Deploy
- **Bundler**: Vite for frontend, esbuild for backend
- **Package Manager**: npm with lockfile
- **Deployment**: Replit autoscale deployment target

## Deployment Strategy

### Development Environment
- **Platform**: Replit development environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: Provisioned PostgreSQL instance
- **Port Configuration**: Frontend on 5000, proxied through Replit

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles to `dist/index.js`
- **Static Assets**: Served from build directory
- **Process**: Single Node.js process serving both API and static files

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **OpenAI**: `OPENAI_API_KEY` for AI services
- **Auth**: `SESSION_SECRET` and OIDC configuration
- **Deployment**: Replit-managed environment variables

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

✓ Created comprehensive admin dashboard with user and story management
✓ Switched from OpenAI to Gemini API for AI story generation 
✓ Fixed button visibility issues with proper opacity classes
✓ Added role-based admin authentication system
✓ Configured admin access for atharvbhosale00@gmail.com
✓ Fixed custom story generation with proper Gemini API integration
✓ Added debugging logs for story creation process
✓ Resolved API key configuration for Gemini services

## Changelog

- June 24, 2025: Initial setup with OpenAI integration
- June 24, 2025: Switched to Gemini API and added admin dashboard