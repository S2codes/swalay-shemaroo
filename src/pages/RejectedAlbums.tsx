import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music, Search, Download, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import fileDownload from "js-file-download";
import { exportAlbumsWithTracksToCSV } from "@/lib/utils";

interface Album {
  _id: string;
  title: string;
  artist: string;
  genre?: string;
  language?: string;
  tags?: string[];
  releasedate?: string;
  totalTracks?: number;
  upc?: string | null;
  thumbnail?: string;
  status?: number;
}

const RejectedAlbums = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shemaroo/getalbums?status=${import.meta.env.VITE_ALBUM_REJECTED}`);
 
      const data = response.data;

      let albums: Album[] = [];
      if (Array.isArray(data)) {
        albums = data;
      } else if (data && Array.isArray(data.albums)) {
        albums = data.albums;
      } else if (data && Array.isArray(data.data)) {
        albums = data.data;
      }
      setAlbumData(albums);
    } catch (err) {
      setError("Failed to load albums. Please try again later.");
      setAlbumData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Protect route
    if (!localStorage.getItem("swalay_auth")) {
      navigate("/signin");
      return;
    }
    fetchAlbums();
  }, []);

  const filteredAlbums = useMemo(() => {
    if (!Array.isArray(albumData)) return [];
    return albumData.filter((album) => {
      // Only show albums where status is not 1 (pending)
      if (album.status === 1) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        album.title.toLowerCase().includes(searchLower) ||
        (album.artist && album.artist.toLowerCase().includes(searchLower)) ||
        (album.genre && album.genre.toLowerCase().includes(searchLower)) ||
        (album.language && album.language.toLowerCase().includes(searchLower)) ||
        (album.tags && album.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    });
  }, [searchTerm, albumData]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return "N/A";
    }
  };

  const handleExportAll = async () => {
    try {
      // Show loading state
      const exportButton = document.querySelector('[data-export-button]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.disabled = true;
        exportButton.innerHTML = '<RefreshCw className="h-4 w-4 animate-spin" /> Exporting...';
      }

      // Filter albums to only include rejected ones (status !== 1 and status !== 2)
      const rejectedAlbums = albumData.filter(album => album.status !== 1 && album.status !== 2);

      // Fetch tracks for each album
      const tracksData: { [albumId: string]: any[] } = {};
      
      for (const album of rejectedAlbums) {
        try {
          const tracksRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/track/getTracks?albumId=${album._id}`
          );
          
          tracksData[album._id] = Array.isArray(tracksRes.data)
            ? tracksRes.data
            : tracksRes.data.data || [];
        } catch (err) {
          console.error(`Error fetching tracks for album ${album._id}:`, err);
          tracksData[album._id] = [];
        }
      }

      // Generate CSV using the utility function
      const csvContent = exportAlbumsWithTracksToCSV(rejectedAlbums, tracksData);
      
      // Download the file
      fileDownload(csvContent, "rejected_albums_with_tracks.csv");
      
    } catch (err) {
      console.error("Error exporting albums:", err);
      // Fallback to original export if the new one fails
      const headers = [
        "Title",
        "Artist",
        "Tags",
        "Genre",
        "Language",
        "Release Date",
        "Tracks",
        "UPC"
      ];
      const rows = albumData.filter(album => album.status !== 1 && album.status !== 2).map(album => [
        album.title,
        album.artist,
        (album.tags || []).join("; "),
        album.genre || "",
        album.language || "",
        album.releasedate || "",
        album.totalTracks?.toString() || "",
        album.upc || ""
      ]);
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
      ].join("\r\n");
      fileDownload(csvContent, "rejected_albums.csv");
    } finally {
      // Reset button state
      const exportButton = document.querySelector('[data-export-button]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<Download className="h-4 w-4" /> Export All';
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Loading rejected albums...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-500 text-center">{error}</p>
          <Button 
            onClick={fetchAlbums}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rejected Albums</h1>
            <p className="text-gray-600">Albums that are Rejected</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchAlbums}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2"
              onClick={handleExportAll}
              data-export-button
            >
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Rejected Album Collection
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rejected albums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Album</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Tracks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlbums.length > 0 ? (
                    filteredAlbums.map((album) => (
                      <TableRow key={album._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {album.thumbnail ? (
                              <img 
                                src={`${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/cover/${album.thumbnail}`} 
                                alt={album.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                                <Music className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{album.title}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{album.artist || 'Unknown'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {album.tags?.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant={
                                  tag === 'Happy' ? 'default' : 
                                  tag === 'Sad' ? 'secondary' : 
                                  'outline'
                                }
                              >
                                {tag}
                              </Badge>
                            ))}
                            {(!album.tags || album.tags.length === 0) && (
                              <span className="text-sm text-gray-400">No tags</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{album.genre || 'N/A'}</TableCell>
                        <TableCell>{album.language || 'N/A'}</TableCell>
                        <TableCell>{formatDate(album.releasedate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{album.totalTracks || 0} tracks</Badge>
                        </TableCell>
                        <TableCell>
                          <Link to={`/album/${btoa(album._id)}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Music className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {searchTerm ? 'No rejected albums match your search' : 'No rejected albums found'}
                          </p>
                          {searchTerm && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSearchTerm('')}
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RejectedAlbums; 