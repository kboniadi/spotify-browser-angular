import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArtistData } from "../../data/artist-data";
import { TrackData } from "../../data/track-data";
import { AlbumData } from "../../data/album-data";
import { TrackFeature } from "../../data/track-feature";
import { SpotifyService } from "src/app/services/spotify.service";
import { HandTrackerService } from "src/app/services/hand-tracker.service";

declare const window: any;

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

@Component({
  selector: "app-track-page",
  templateUrl: "./track-page.component.html",
  styleUrls: ["./track-page.component.css"],
})
export class TrackPageComponent implements OnInit {
  trackId: string;
  track: TrackData;
  audioFeatures: TrackFeature[];

  private deviceId = null;
  private player = undefined;
  private is_active = false;
  is_paused = false;
  current_track = track;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private trackingService: HandTrackerService,
    private ref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.trackId = this.route.snapshot.paramMap.get("id");
    //TODO: Inject the spotifyService and use it to get the track data and it's audio features
    this.spotifyService.getTrack(this.trackId).then((result) => {
      this.track = result;
    });

    this.spotifyService.getAudioFeaturesForTrack(this.trackId).then((result) => {
      this.audioFeatures = result;
    });

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = async () => {
      let token = await this.spotifyService.getMyAccessToken()
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      this.player = player;

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        this.deviceId = device_id;
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        this.current_track = state.track_window.current_track;
        this.is_paused = state.paused;

        this.is_active = !state ? false : true;

        this.ref.detectChanges();
      });

      player.connect();

      this.trackingService.onMessageEmit().subscribe((message) => {
        switch (message) {
          case "Open Hand":
            if (this.is_paused) {
              this.playTrack();
            }
            break;
          case "Closed Hand":
            if (!this.is_paused) {
              this.pauseTrack();
            }
            break;
          case "Two Open Hands":
            this.increaseVolume();
            break;
          case "Hand Pinching":
            this.decreaseVolume();
            break;
          case "Hand Pointing":
            this.nextTrack();
            break;
          default:
            break;
        }
      });
    };
  }

  previousTrack() {
    this.player.previousTrack();
  }

  nextTrack() {
    this.player.nextTrack();
  }

  toggleTrack() {
    this.player.togglePlay();
  }

  playTrack() {
    this.player.resume();
  }

  pauseTrack() {
    this.player.pause();
  }

  increaseVolume() {
    this.player.getVolume().then((volume) => {
      this.player.setVolume(volume + 0.1);
    });
  }

  decreaseVolume() {
    this.player.getVolume().then((volume) => {
      this.player.setVolume(volume - 0.1);
    });
  }
}
