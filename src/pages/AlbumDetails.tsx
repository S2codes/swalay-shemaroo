import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, Download, File, Copy, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import fileDownload from "js-file-download";
import ChangeAlbumStatus from "@/components/ChangeAlbumStatus";
import { exportAlbumsWithTracksToCSV } from "@/lib/utils";

interface Track {
  _id: string;
  songName: string;
  duration: string;
  category?: string;
  trackType?: string;
  version?: string;
  crbt?: string;
  isrc?: string;
  singers?: string[];
  composers?: string[];
  lyricists?: string[];
  producers?: string[];
  primarySinger?: string;
  audioFile?: string;
}

interface Album {
  _id: string;
  title: string;
  artist?: string;
  genre?: string;
  language?: string;
  tags?: string[];
  releasedate?: string;
  upc?: string | null;
  thumbnail?: string;
  cline?: string;
  pline?: string;
  mood?: string;
  status?: number;
  shemaroDeliveryStatus?: number;
 
}

const AlbumDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

    const [shemaroStatus, setshemaroStatus] = useState(1);

  // Decode base64 id
  let albumId = "";
  try {
    albumId = id ? atob(id) : "";
  } catch {
    albumId = id || "";
  }

  useEffect(() => {
    // Protect route
    if (!localStorage.getItem("swalay_auth")) {
      navigate("/signin");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch album details
        const albumRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/albums/getAlbumsDetails?albumId=${albumId}`
        );

   
        let albumData = albumRes.data.data;
        setAlbum(albumData);

        // Fetch tracks
        const tracksRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/track/getTracks?albumId=${albumId}`
        );

        setTracks(
          Array.isArray(tracksRes.data)
            ? tracksRes.data
            : tracksRes.data.data || []
        );
      } catch (err) {
        setError("Failed to load album details. Please try again later.");
        setAlbum(null);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    if (albumId) fetchData();
  }, [albumId]);


  const handleStatusChange = (newStatus: number) => {
    setshemaroStatus(newStatus);
    setAlbum(prev => prev ? { ...prev, shemaroDeliveryStatus: newStatus } : prev);
  };


  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const handleExportAlbum = () => {
    if (!album) return;
    
    try {
      // Create tracks data structure for the utility function
      const tracksData = {
        [album._id]: tracks
      };
      
      // Generate CSV using the utility function
      const csvContent = exportAlbumsWithTracksToCSV([album], tracksData);
      
      // Download the file
      fileDownload(csvContent, `${album.title.replace(/[^a-zA-Z0-9]/g, '_')}_with_tracks.csv`);
      
      toast({
        title: "Export Successful!",
        description: `Album "${album.title}" exported with ${tracks.length} tracks.`,
      });
    } catch (err) {
      console.error("Error exporting album:", err);
      toast({
        title: "Export Failed",
        description: "Failed to export album. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Loading album details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !album) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Album not found</h1>
          <p className="text-red-500 mt-2">{error}</p>
          <Link to="/albums">
            <Button className="mt-4">Back to Albums</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/albums">
            <Button variant="outline">
              <ArrowDown className="h-4 w-4 mr-2 rotate-90" />
              Back to Albums
            </Button>
          </Link>
        </div>

        {/* Album Information */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
           

                {album.thumbnail ? (
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
                    alt={album.title}
                    className="w-20 h-20 rounded-lg object-cover shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <File className="h-10 w-10 text-white" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-2xl">{album.title}</CardTitle>
                  <p className="text-gray-600 mt-1">
                    {tracks.length} tracks
                    {album.genre && <> • {album.genre}</>}
                    {album.language && <> • {album.language}</>}
                  </p>
                </div>
              </div>
                <div className="flex gap-2">
                <a
                  href={`${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Download className="h-4 w-4 mr-2" />
                  Download Album
                  </Button>
                </a>

                <Button
                  variant="outline"
                  onClick={() =>
                  handleCopy(JSON.stringify(album, null, 2), "Album details")
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Details
                </Button>

                <Button
                  variant="outline"
                  onClick={handleExportAlbum}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>

                {album.shemaroDeliveryStatus === 2 ? (
                  <Button
                  className="bg-green-500 text-white cursor-default"
                  disabled
                  >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Live
                  </Button>
                ) : album.shemaroDeliveryStatus === 3 ? (
                  <Button
                  variant="destructive"
                  className="bg-red-500 text-white cursor-default"
                  disabled
                  >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Rejected
                  </Button>
                ) : (
                  <ChangeAlbumStatus albumId={album._id}   onStatusChange={handleStatusChange} />
                )}
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mood
                </label>
                <div className="mt-1">
                  <Badge>{album.mood || "N/A"}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Genre
                </label>
                <p className="mt-1 text-gray-900">{album.genre || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Language
                </label>
                <p className="mt-1 text-gray-900">{album.language || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">UPC</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">
                  {album.upc || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Release Date
                </label>
                <p className="mt-1 text-gray-900">
                  {formatDate(album.releasedate)}
                </p>
              </div>
            </div>
            <Separator />

            <div className="flex gap-8">
              <div className=" w-1/2">
                <label className="text-sm font-medium text-gray-500">
                  Copyright Line
                </label>
                <p className="mt-1 text-gray-900">© {album.cline || "N/A"}</p>
              </div>
              <div className=" w-1/2">
                <label className="text-sm font-medium text-gray-500">
                  Phonogram Line
                </label>
                <p className="mt-1 text-gray-900">℗ {album.pline || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Tracks ({tracks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tracks.map((track, index) => (
                <div
                  key={track._id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <File className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {track.songName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {track.duration ? `${track.duration} sec` : "N/A"}
                          </span>
                          {track.category && (
                            <Badge variant="outline">{track.category}</Badge>
                          )}
                          <span className="font-mono">
                            {track.isrc || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">

                      <a
                        href={`${import.meta.env.VITE_AWS_S3_BASE_URL}/albums/07c1a${album._id}ba3/tracks/${track.audioFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopy(
                            JSON.stringify(track, null, 2),
                            "Track details"
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-gray-500">
                        Category
                      </label>
                      <p className="text-gray-900">{track.category || "N/A"}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">
                        Track Type
                      </label>
                      <p className="text-gray-900">
                        {track.trackType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">
                        Version
                      </label>
                      <p className="text-gray-900">{track.version || "N/A"}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">CRBT</label>
                      <p className="text-gray-900 font-mono">
                        {track.crbt || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">ISRC</label>
                      <p className="text-gray-900 font-mono">
                        {track.isrc || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">
                        Singer(s)
                      </label>
                      <p className="text-gray-900">
                        {track.singers?.join(", ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">
                        Lyricist(s)
                      </label>
                      <p className="text-gray-900">
                        {track.lyricists?.join(", ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">
                        Composer(s)
                      </label>
                      <p className="text-gray-900">
                        {track.composers?.join(", ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">
                        Producer(s)
                      </label>
                      <p className="text-gray-900">
                        {track.producers?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AlbumDetails;
