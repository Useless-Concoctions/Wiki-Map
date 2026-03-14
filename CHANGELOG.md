# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-03-13

### Added
- **Dark Mode Aesthetic**: Completely redesigned the UI with a stunning cyberpunk/neon dark theme.
- **Glassmorphism 2.0**: Darkened glass panels with increased blur and subtle borders.
- **Neon Highlights**: Vibrant purple and cyan glowing elements (`box-shadow`, gradients) for markers and controls.
- **CartoDB Dark Matter**: Switched the base map to a dark variant for optimal contrast.
- **Enhanced Typography**: Added wider spacing/tracking to text for a more futuristic feel.

## [0.2.0] - 2026-03-13

### Added
- **UI/UX Overhaul**: Completely redesigned the application with a premium, mobile-native aesthetic.
- **New Typography**: Switched to the "Outfit" Google Font for improved readability and modern feel.
- **Glassmorphism Design**: Implemented frosted glass effects across all UI controls (Radius, Article Count, Profile, and Panels).
- **Locate Me Button**: Added a dedicated control to quickly re-center and zoom to the user's current location.
- **Custom Markers**: 
  - Designed custom SVG "W" markers for Wikipedia articles.
  - Added a pulsing animation for the user's current location marker.
  - markers now scale up and highlight when selected.
- **Enhanced Article Panel**: 
  - New mobile-native drawer with a drag-handle.
  - Smooth Bezier-curve transitions (0.32, 0.72, 0, 1).
  - High-quality image previews and skeleton loading states.
- **Map Provider**: Switched to CartoDB Voyager for a cleaner, more professional map aesthetic.

### Changed
- Improved layout responsiveness for all screen sizes (mobile-first approach).
- Enhanced map interaction handling with better Leaflet instance management.
- Modernized global design tokens and CSS variables.

## [0.1.0] - 2026-03-13

### Added
- Initial release of Wiki Map.
- Basic map functionality with Wikipedia geosearch integration.
- Radius control (500m, 1km, 2km).
- Basic article preview panel.
- Geolocation tracking.
