
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, Music, Download, File, Copy } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

// Dummy data
const albumsData = {
  1: {
    title: "Happy Vibes",
    mood: "Happy",
    genre: "Film",
    language: "Garhwali",
    upc: "UPC123456789",
    releaseDate: "April 3, 2025",
    cLine: "© 2025 SwaLay Digital",
    pLine: "℗ 2025 SwaLay Digital",
    tracks: [
      {
        id: 1,
        title: "Mountain Sunrise",
        mood: "Happy",
        duration: "3:45",
        crbt: "00:00:15",
        isrc: "INT632503001",
        category: "CHORAL MUSIC",
        trackType: "Vocal",
        version: "Original",
        callerTune: "00:00:10",
        singer: "test artist 3 • new artist test 5 all rounder",
        featured: "Featured Artist Name",
        lyricist: "Artist test 2 • new artist test 5 all rounder",
        composer: "test artist 3 • Golu Bantai Updated 3 • Test Composer",
        musicProducer: "test artist 3 • new artist test 5 all rounder"
      },
      {
        id: 2,
        title: "Valley Dreams",
        mood: "Happy",
        duration: "4:12",
        crbt: "00:00:20",
        isrc: "INT632503002",
        category: "FOLK MUSIC",
        trackType: "Vocal",
        version: "Original",
        callerTune: "00:00:15",
        singer: "new artist test 5 all rounder",
        featured: "Guest Vocalist",
        lyricist: "Artist test 2",
        composer: "Golu Bantai Updated 3 • Test Composer",
        musicProducer: "test artist 3"
      }
    ]
  }
};

const AlbumDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const album = albumsData[id as keyof typeof albumsData];

  if (!album) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Album not found</h1>
          <Link to="/albums">
            <Button className="mt-4">Back to Albums</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleDownload = (type: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${type}...`,
    });
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

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
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{album.title}</CardTitle>
                  <p className="text-gray-600 mt-1">
                    {album.tracks.length} tracks • {album.genre} • {album.language}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleDownload("album")} className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Download className="h-4 w-4 mr-2" />
                  Download Album
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleCopy(JSON.stringify(album, null, 2), "Album details")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Details
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Mood</label>
                <div className="mt-1">
                  <Badge>{album.mood}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Genre</label>
                <p className="mt-1 text-gray-900">{album.genre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Language</label>
                <p className="mt-1 text-gray-900">{album.language}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">UPC</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">{album.upc}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Release Date</label>
                <p className="mt-1 text-gray-900">{album.releaseDate}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Copyright Line</label>
                <p className="mt-1 text-gray-900">{album.cLine}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phonogram Line</label>
                <p className="mt-1 text-gray-900">{album.pLine}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Tracks ({album.tracks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {album.tracks.map((track, index) => (
                <div key={track.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{track.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{track.duration}</span>
                          <Badge variant="outline">{track.mood}</Badge>
                          <span className="font-mono">{track.isrc}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(`track ${track.title}`)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopy(JSON.stringify(track, null, 2), "Track details")}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-gray-500">Category</label>
                      <p className="text-gray-900">{track.category}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">Track Type</label>
                      <p className="text-gray-900">{track.trackType}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">Version</label>
                      <p className="text-gray-900">{track.version}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">Caller Tune</label>
                      <p className="text-gray-900 font-mono">{track.callerTune}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">CRBT</label>
                      <p className="text-gray-900 font-mono">{track.crbt}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">ISRC</label>
                      <p className="text-gray-900 font-mono">{track.isrc}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">Singer</label>
                      <p className="text-gray-900">{track.singer}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">Featured</label>
                      <p className="text-gray-900">{track.featured}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-500">Lyricist</label>
                      <p className="text-gray-900">{track.lyricist}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-medium text-gray-500">Composer</label>
                      <p className="text-gray-900">{track.composer}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-medium text-gray-500">Music Producer</label>
                      <p className="text-gray-900">{track.musicProducer}</p>
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
