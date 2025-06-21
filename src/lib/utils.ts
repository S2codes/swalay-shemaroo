import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import JSZip from "jszip";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportAlbumsWithTracksToCSV(albums: any[], tracksData: { [albumId: string]: any[] }) {
  // Define CSV headers for track + album data
  const headers = [
    // Track details
    "Track ID",
    "Song Name", 
    "Duration",
    "Category",
    "Track Type",
    "Version",
    "CRBT",
    "ISRC",
    "Singers",
    "Composers",
    "Lyricists", 
    "Producers",
    "Primary Singer",
    "Audio File URL",
    // Album details
    "Album ID",
    "Album Title",
    "Album Artist",
    "Album Genre",
    "Album Language",
    "Album Tags",
    "Album Release Date",
    "Album UPC",
    "Album Cover URL",
    "Album Mood",
    "Album Copyright Line",
    "Album Phonogram Line"
  ];

  const rows: string[][] = [];
  let serialNumber = 1; // Initialize serial number counter

  // Process each album and its tracks
  albums.forEach(album => {
    const albumTracks = tracksData[album._id] || [];
    
    const albumCoverUrl = album.thumbnail 
      ? `${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/cover/${album.thumbnail}`
      : "";

    // If no tracks, still create one row with album info and empty track fields
    if (albumTracks.length === 0) {
      rows.push([
        serialNumber.toString(), // Serial number
        "", // Song Name
        "", // Duration
        "", // Category
        "", // Track Type
        "", // Version
        "", // CRBT
        "", // ISRC
        "", // Singers
        "", // Composers
        "", // Lyricists
        "", // Producers
        "", // Primary Singer
        "", // Audio File URL
        album._id || "",
        album.title || "",
        album.artist || "",
        album.genre || "",
        album.language || "",
        (album.tags || []).join("; "),
        album.releasedate || "",
        album.upc || "",
        albumCoverUrl,
        album.mood || "",
        album.cline || "",
        album.pline || ""
      ]);
      serialNumber++; // Increment serial number even for albums without tracks
    } else {
      // Create a row for each track with album details
      albumTracks.forEach(track => {
        const trackAudioUrl = track.audioFile
          ? `${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/tracks/${track.audioFile}`
          : "";
        rows.push([
          serialNumber.toString(), // Serial number
          track.songName || "",
          track.duration || "",
          track.category || "",
          track.trackType || "",
          track.version || "",
          track.crbt || "",
          track.isrc || "",
          (track.singers || []).join("; "),
          (track.composers || []).join("; "),
          (track.lyricists || []).join("; "),
          (track.producers || []).join("; "),
          track.primarySinger || "",
          trackAudioUrl,
          album._id || "",
          album.title || "",
          album.artist || "",
          album.genre || "",
          album.language || "",
          (album.tags || []).join("; "),
          album.releasedate || "",
          album.upc || "",
          albumCoverUrl,
          album.mood || "",
          album.cline || "",
          album.pline || ""
        ]);
        serialNumber++; // Increment serial number for each track
      });
    }
  });

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
  ].join("\r\n");

  return csvContent;
}

export async function createAlbumsZip(
  albums: any[],
  tracksData: { [albumId: string]: any[] },
  onProgress: (progress: { percent: number; message: string }) => void
) {
  const zip = new JSZip();
  let filesProcessed = 0;
  
  // Calculate total number of files to process for accurate progress tracking
  const totalFiles = albums.reduce((count, album) => {
    const hasCover = !!album.thumbnail;
    const trackCount = tracksData[album._id]?.length || 0;
    return count + (hasCover ? 1 : 0) + trackCount;
  }, 0);

  if (totalFiles === 0) {
    onProgress({ percent: 100, message: "No files to download." });
    return null;
  }

  onProgress({ percent: 0, message: "Starting download..." });

  for (const album of albums) {
    // Sanitize album title to use as a folder name
    const albumFolderName = album.title.replace(/[^a-zA-Z0-9-_\.]/g, '_');
    const albumFolder = zip.folder(albumFolderName);

    if (!albumFolder) {
      console.error(`Failed to create folder for album: ${album.title}`);
      continue;
    }

    // --- Download Album Cover ---
    if (album.thumbnail) {
      const coverUrl = `${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/cover/${album.thumbnail}`;
      const message = `Downloading cover for ${album.title}...`;
      onProgress({ percent: (filesProcessed / totalFiles) * 100, message });
      
      try {
        const response = await axios.get(coverUrl, { responseType: 'blob' });
        albumFolder.file(album.thumbnail, response.data);
      } catch (error) {
        console.error(`Could not download or add cover for ${album.title}:`, error);
      } finally {
        filesProcessed++;
      }
    }

    // --- Download Tracks ---
    const tracks = tracksData[album._id] || [];
    for (const track of tracks) {
      if (track.audioFile) {
        const trackUrl = `${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/tracks/${track.audioFile}`;
        const message = `Downloading track: ${track.songName}...`;
        onProgress({ percent: (filesProcessed / totalFiles) * 100, message });

        try {
          const response = await axios.get(trackUrl, { responseType: 'blob' });
          albumFolder.file(track.audioFile, response.data);
        } catch (error) {
          console.error(`Could not download or add track ${track.songName}:`, error);
        } finally {
          filesProcessed++;
        }
      } else {
        filesProcessed++; // Still increment if a track has no audio file to keep progress accurate
      }
    }
  }

  onProgress({ percent: 100, message: "Zipping files..." });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  
  onProgress({ percent: 100, message: "Download complete!" });
  return zipBlob;
}
