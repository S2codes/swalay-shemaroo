# Swalay Sheemaru P2

A React/TypeScript application for managing music albums and tracks.

## Features

### Enhanced Export Functionality

The application now includes an enhanced export feature that exports albums with their tracks to CSV format. This provides a comprehensive view of all music data in a structured format.

#### Export Features:

1. **Track-Level Export**: Each track is exported as a separate row with its associated album details
2. **Comprehensive Data**: Includes both track and album information in a single CSV file
3. **Multiple Export Options**:
   - **Albums Page**: Export all albums with their tracks
   - **Live Albums Page**: Export only live albums with their tracks  
   - **Rejected Albums Page**: Export only rejected albums with their tracks
   - **Album Details Page**: Export a single album with its tracks

#### CSV Structure:

The exported CSV includes the following columns:

**Track Details:**
- Track ID
- Song Name
- Duration
- Category
- Track Type
- Version
- CRBT
- ISRC
- Singers
- Composers
- Lyricists
- Producers
- Primary Singer
- Audio File Name

**Album Details:**
- Album ID
- Album Title
- Album Artist
- Album Genre
- Album Language
- Album Tags
- Album Release Date
- Album UPC
- Album Cover File Name
- Album Mood
- Album Copyright Line
- Album Phonogram Line

#### Example Output:

For an album named "Test Albums" with two tracks "track 1" and "track 2", the CSV will contain:

```
Track ID,Song Name,Duration,...,Album ID,Album Title,Album Artist,...
track1_id,track 1,180,...,album_id,Test Albums,Artist Name,...
track2_id,track 2,200,...,album_id,Test Albums,Artist Name,...
```

#### Usage:

1. Navigate to any of the album pages (Albums, Live Albums, Rejected Albums)
2. Click the "Export All" button
3. The system will fetch all tracks for each album and generate a comprehensive CSV
4. The file will be automatically downloaded with a descriptive filename

For individual album export:
1. Navigate to an album's detail page
2. Click the "Export CSV" button
3. The album and its tracks will be exported to a CSV file named after the album

#### Technical Implementation:

- Uses async/await for efficient data fetching
- Includes loading states during export process
- Provides fallback to original export if enhanced export fails
- Handles missing data gracefully with "N/A" placeholders
- Properly escapes CSV content to handle special characters

## Getting Started

// ... existing code ...
