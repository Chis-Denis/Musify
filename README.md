# 🎵 Musify - Modern Music Streaming Platform

[![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/download/dotnet/8.0)
[![Angular](https://img.shields.io/badge/Angular-19-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Cypress](https://img.shields.io/badge/Cypress-12.17-green.svg)](https://www.cypress.io/)
[![Azure](https://img.shields.io/badge/Azure-Pipelines-blue.svg)](https://azure.microsoft.com/)

A full-stack music streaming application built with modern technologies, featuring a comprehensive architecture with separate frontend, backend, and testing components. Musify provides a complete music platform with user authentication, playlist management, artist profiles, and admin capabilities.

## 🌟 Features

### 🎼 Music Management
- **Song Library**: Upload, manage, and organize music tracks
- **Album Collections**: Create and manage albums with multiple songs
- **Artist Profiles**: Support for both individual artists and bands
- **Genre Categorization**: Organize music by genres
- **Alternative Titles**: Multiple titles for songs in different languages

### 👥 User Experience
- **Authentication**: Secure JWT-based login/register system
- **Password Reset**: Email-based password recovery
- **Role-Based Access**: Admin and user roles with different permissions
- **User Profiles**: Public and private profile management
- **Country-Based Access**: Location-aware content delivery

### 📱 Social Features
- **Playlist System**: Create, manage, and share playlists
- **Public/Private Playlists**: Control playlist visibility
- **Follow System**: Follow other users' playlists
- **Content Discovery**: Browse trending songs and new releases
- **User Following**: Connect with other music enthusiasts

### 🔧 Admin Capabilities
- **User Management**: Administer user accounts and roles
- **Content Moderation**: Manage songs, albums, and artists
- **System Administration**: Comprehensive admin dashboard
- **Data Management**: Full CRUD operations on all entities

### 🎵 Music Player
- **Audio Streaming**: Play music directly in the browser
- **Playlist Management**: Add/remove songs from playlists
- **Queue System**: Manage playback queue
- **Search & Discovery**: Find music by title, artist, or album

## 🏗️ Architecture

### Backend (.NET 8.0)
```
practica-2025-musify/
├── Domain/                 # Core business entities
│   ├── Entities/          # Domain models
│   └── Enums/            # Business enums
├── Application/           # Business logic layer
│   ├── Interfaces/       # Service contracts
│   ├── UseCases/         # Business services
│   └── Contracts/        # Repository interfaces
├── Infrastructure/        # Data access layer
│   ├── Data/            # DbContext and migrations
│   └── Repositories/     # Data access implementations
├── Musify/              # API layer
│   ├── Controllers/     # REST API endpoints
│   ├── DTOs/           # Data transfer objects
│   ├── Mapping/        # Entity-DTO mappings
│   └── Validations/    # Input validation
└── Musify.Tests/        # Unit and integration tests
```

### Frontend (Angular 19)
```
angular-net/
├── src/app/
│   ├── components/      # UI components
│   │   ├── admin/      # Admin panel components
│   │   ├── auth/       # Authentication components
│   │   ├── home/       # Main application
│   │   ├── music/      # Music-related components
│   │   └── shared/     # Reusable components
│   ├── services/       # API services
│   ├── models/         # TypeScript interfaces
│   ├── guards/         # Route guards
│   └── config/         # Application configuration
├── src/assets/         # Static assets
└── src/environments/   # Environment configuration
```

### Testing (Cypress)
```
musify-cypress/
├── cypress/e2e/
│   ├── api-tests/      # Backend API testing
│   ├── ui-tests/       # Frontend component testing
│   ├── integration/    # Cross-feature testing
│   └── utils/          # Test utilities
├── cypress/fixtures/   # Test data
└── cypress/support/    # Custom commands
```

## 🚀 Getting Started - Complete Local Setup

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 22.x](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) or [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads)
- [Git](https://git-scm.com/)

### Step 1: Clone and Setup Database

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Musify
   ```

2. **Setup SQL Server Database**
   ```bash
   # Install SQL Server (if not already installed)
   # For Windows: Download from Microsoft
   # For macOS/Linux: Use Docker
   docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
     -p 1433:1433 --name sql1 --hostname sql1 \
     -d mcr.microsoft.com/mssql/server:2022-latest
   ```

3. **Update Database Connection**
   ```bash
   # Edit practica-2025-musify/Musify/appsettings.json
   # Replace the connection string with your local database:
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost,1433;Database=MusifyDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
   }
   ```

### Step 2: Backend Setup

1. **Navigate to backend project**
   ```bash
   cd practica-2025-musify
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Run database migrations**
   ```bash
   cd Musify
   dotnet ef database update
   ```

4. **Seed initial data (optional)**
   ```bash
   # The application includes a DbSeeder that will populate initial data
   # This runs automatically on first startup
   ```

5. **Start the API**
   ```bash
   dotnet run
   ```
   
   **Verify API is running:**
   - API will be available at `https://localhost:7000`
   - Swagger documentation at `https://localhost:7000/swagger`
   - Test with: `curl https://localhost:7000/api/album`

### Step 3: Frontend Setup

1. **Navigate to Angular project**
   ```bash
   cd angular-net
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL for local development**
   ```bash
   # Edit src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7000'
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   **Verify frontend is running:**
   - Application will be available at `http://localhost:4200`
   - Should automatically open in your browser

### Step 4: Verify Complete Setup

1. **Test Backend API**
   ```bash
   # Test album endpoint
   curl -k https://localhost:7000/api/album
   
   # Test authentication endpoint
   curl -k -X POST https://localhost:7000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Test123!","country":"US"}'
   ```

2. **Test Frontend Application**
   - Open `http://localhost:4200` in your browser
   - You should see the login page
   - Register a new account
   - Login and explore the application

3. **Test Admin Features**
   - Register a new user
   - In the database, update the user's role to "admin":
   ```sql
   UPDATE Users SET Role = 'admin' WHERE Email = 'your-email@example.com'
   ```
   - Login again to access admin features

### Step 5: Running Tests (Optional)

1. **Backend Tests**
   ```bash
   cd practica-2025-musify
   dotnet test
   ```

2. **Frontend E2E Tests**
   ```bash
   cd musify-cypress
   npm install
   npm run test
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Music Endpoints
- `GET /api/album` - Get all albums
- `POST /api/album` - Create album (Admin only)
- `GET /api/song` - Get all songs
- `POST /api/song` - Create song (Admin only)
- `GET /api/artist` - Get all artists
- `POST /api/artist` - Create artist (Admin only)

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

### Playlist Endpoints
- `GET /api/playlist` - Get user playlists
- `POST /api/playlist` - Create playlist
- `PUT /api/playlist/{id}` - Update playlist
- `DELETE /api/playlist/{id}` - Delete playlist

## 🔧 Configuration

### Environment Variables

**Backend (.NET)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=MusifyDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "2uTzXbC0eN6sHfK1LgP4oDqEiVaq$Y7Zk&9pL#v8Wm@F3jR!",
    "Issuer": "musify-api",
    "Audience": "musify-users"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:4200"
    ]
  }
}
```

**Frontend (Angular)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000'
};
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Service layer and business logic
- **Integration Tests**: API endpoints and database operations
- **Repository Tests**: Data access layer validation

### Frontend Testing
- **E2E Tests**: Complete user workflows
- **API Tests**: Backend integration validation
- **UI Tests**: Component and page functionality
- **Integration Tests**: Cross-feature workflows

### Test Categories
- ✅ Authentication flows
- ✅ Admin functionality
- ✅ Music browsing and management
- ✅ Playlist operations
- ✅ User profile management
- ✅ Search functionality
- ✅ Navigation and routing

## 🚀 Deployment

### Azure Deployment
The project includes Azure DevOps pipelines for automated deployment:

1. **Backend Pipeline** (`azure-pipelines.yml`)
   - Builds .NET solution
   - Runs unit tests
   - Publishes artifacts
   - Deploys to Azure App Service

2. **Frontend Pipeline** (`angular-net/azure-pipelines.yml`)
   - Installs Node.js dependencies
   - Builds Angular application
   - Publishes to Azure Static Web Apps

### Manual Deployment
1. Build the backend: `dotnet publish -c Release`
2. Build the frontend: `npm run build --prod`
3. Deploy to your preferred hosting platform

## 🔮 Roadmap

- [ ] Mobile application (React Native)
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Music recommendations
- [ ] Social media integration
- [ ] Offline playback
- [ ] Podcast support
- [ ] Live streaming capabilities

---

**Built with ❤️ using .NET 8, Angular 19, and Cypress**
