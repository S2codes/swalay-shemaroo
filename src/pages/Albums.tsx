
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music, Search, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// Dummy data
const albums = [
  {
    id: 1,
    title: "Happy Vibes",
    mood: "Happy",
    genre: "Film",
    language: "Garhwali",
    upc: "UPC123456789",
    releaseDate: "April 3, 2025",
    cLine: "© 2025 SwaLay Digital",
    pLine: "℗ 2025 SwaLay Digital",
    trackCount: 8,
    coverImage: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Melancholy Dreams",
    mood: "Sad",
    genre: "Classical",
    language: "Hindi",
    upc: "UPC987654321",
    releaseDate: "March 15, 2025",
    cLine: "© 2025 SwaLay Digital",
    pLine: "℗ 2025 SwaLay Digital",
    trackCount: 6,
    coverImage: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Dance Floor Hits",
    mood: "Dance",
    genre: "Electronic",
    language: "English",
    upc: "UPC456789123",
    releaseDate: "February 28, 2025",
    cLine: "© 2025 SwaLay Digital",
    pLine: "℗ 2025 SwaLay Digital",
    trackCount: 12,
    coverImage: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Mountain Echoes",
    mood: "Happy",
    genre: "Folk",
    language: "Garhwali",
    upc: "UPC789123456",
    releaseDate: "January 10, 2025",
    cLine: "© 2025 SwaLay Digital",
    pLine: "℗ 2025 SwaLay Digital",
    trackCount: 10,
    coverImage: "/placeholder.svg"
  }
];

const Albums = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlbums = useMemo(() => {
    return albums.filter(album =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.mood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Albums</h1>
            <p className="text-gray-600">Manage your music catalog</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Album Collection
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Album</TableHead>
                    <TableHead>Mood</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Tracks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlbums.map((album) => (
                    <TableRow key={album.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                            <Music className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{album.title}</div>
                            <div className="text-sm text-gray-500">{album.upc}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={album.mood === 'Happy' ? 'default' : album.mood === 'Sad' ? 'secondary' : 'outline'}>
                          {album.mood}
                        </Badge>
                      </TableCell>
                      <TableCell>{album.genre}</TableCell>
                      <TableCell>{album.language}</TableCell>
                      <TableCell>{album.releaseDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{album.trackCount} tracks</Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/album/${album.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Albums;
