# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.4.0] - 2026-03-14

### Added
- **Performance Caching**: Implemented persistent `localStorage` caching for article results, drastically improving load times for repeated visits.
- **Increased Pin Density**: Raised the limit of visible pins across all zoom levels to offer more points of interest.
- **Click Debugging**: Added console logging for marker interactions to ensure stability.
- **Global Wikipedia Search**: Upgraded the search bar to perform full text-based Wikipedia searches with automatic map navigation to results.
- **Floating Article Card**: Reimagined the article details as a responsive floating card that matches the search bar width and sits below it, rather than a full-height sidebar.
- **Smart API Fallback**: Implemented a fallback mechanism for zoomed-out views; if the map area is too large for a bounding box search, it automatically performs a radius-based search to ensure pins always show.
- **Enhanced Onboarding**: Redesigned the location requirement screen into a friendly onboarding experience that allows immediate fallback to a default location (Toronto) if GPS is unavailable.
- **Maintenance Category Filtering**: Expanded filters to exclude technical metadata categories like `CS1:` and `unfit URL`.
- **Increased Map Density**: Doubled the pin limit across all zoom levels to improve exploration.

### Changed
- **Pin Interactivity**: Fixed reliability of pin clicks by optimizing pointer event propagation and handling.
- **Header UI Overhaul**: Redesigned the header to a high-density horizontal layout where categories appear beside the search bar.
- **UI Synchronization**: Unified the search bar and category filters with identical styling: `h-10` height, `rounded-full` pill shapes, `shadow-md`, and matching bold text.
- **Compact Controls**: Resized the zoom and location buttons to be less intrusive.
- **Marker Styling**: Refined the pin SVG with a thicker stroke for better contrast against map tiles.
- **Map Loading Logic**: The application now intelligently prioritizes pin loading based on distance and viewport zoom without requiring a manual range toggle.
- **Category Label Normalization**: Standardized display labels by stripping redundant phrases like "buildings and structures" or "in [Location]" from category names.
- **Visual Consistency**: Aligned font sizes and weights (`text-xs font-bold`) across all navigation elements.

### Fixed
- **Infinite Re-render Loop**: Resolved a critical performance bug where viewport synchronization caused excessive component updates.
- **Pointer Event Blocking**: Fixed an issue where the category filter container could block map interactions.
- **Import Error**: Cleaned up unused `RadiusControl` import causing linting issues.

### Removed
- **Radius Control**: Eliminated the redundant range selector to simplify the user interface.
- **Map Search Icon**: Removed the decorative search icon from the bar to save space.

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
