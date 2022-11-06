import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArtistData } from "../../data/artist-data";
import { TrackData } from "../../data/track-data";
import { AlbumData } from "../../data/album-data";
import { SpotifyService } from "src/app/services/spotify.service";

@Component({
  selector: "app-artist-page",
  templateUrl: "./artist-page.component.html",
  styleUrls: ["./artist-page.component.css"],
})
export class ArtistPageComponent implements OnInit {
  artistId: string;
  artist: ArtistData;
  relatedArtists: ArtistData[];
  topTracks: TrackData[];
  albums: AlbumData[];

  constructor(private route: ActivatedRoute, private service: SpotifyService) {}

  ngOnInit() {
    // this.artistId = this.route.snapshot.paramMap.get("id");
    //TODO: Inject the spotifyService and use it to get the artist data, related artists, top tracks for the artist, and the artist's albums
    // EventListener that runs if params change
    this.route.params.subscribe(params => {
      this.artistId = params["id"];

      this.service.getArtist(this.artistId).then((result) => {
        this.artist = result;
      });
  
      this.service.getTopTracksForArtist(this.artistId).then((result) => {
        this.topTracks = result;
      });
  
      this.service.getAlbumsForArtist(this.artistId).then((result) => {
        this.albums = result;
      });
  
      this.service.getRelatedArtists(this.artistId).then((result) => {
        this.relatedArtists = result;
      });
    })
  }
}
