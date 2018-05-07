import {Component, OnInit, ViewChild} from "@angular/core";
import {Song, SongCollection} from "./song.model";
import {SongService} from "./song.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerService} from "../player/player.service";
import {MatPaginator, MatSort, MatTableDataSource, Sort} from "@angular/material";

@Component({
  selector: 'app-song',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnDefs = [
    {name: 'title', title: 'Title'},
    {name: 'artist.name', title: 'Artist'},
    {name: 'album.title', title: 'Album'},
    {name: 'track', title: 'Tack'},
    {name: 'genre', title: 'Genre'},
    {name: 'yearPublished', title: 'Year'}/*,
    {name: 'duration', title: 'Duration'}*/
  ];

  songs: Song[] = [];
  dataSource = new MatTableDataSource<Song>(this.songs);

  displayedColumns = ['command', 'title', 'artist.name', 'album.title', 'track', 'genre', 'yearPublished', 'duration'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (!params.has("type")) {
        // all songs
        this.songService.getAllSongs().subscribe(songs => this.setSongs(songs));
      }
      else {
        const kind = params.get("type");
        const id = params.get("id");
        if (kind === "album") {
          this.songService.getAllSongsOfAlbum(id).subscribe(songs => this.setSongs(songs));
        }
        else if (kind === "artist") {
          this.songService.getAllSongsOfArtist(id).subscribe(songs => this.setSongs(songs));
        }
        else if (kind === "playlist") {
          this.songService.getAllSongsOfPlaylist(id).subscribe(songs => this.setSongs(songs));
        }
      }
    });
  }

  setSongs(songCollection: SongCollection) {
    console.log(songCollection);
    this.songs = songCollection.songs;
    this.dataSource = new MatTableDataSource(this.songs);
    this.dataSource.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  playSong(song: Song) {
    this.playerService.playSong(song);
  }

  queueSong(song: Song) {
    this.playerService.addSong(song);
  }

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )}
