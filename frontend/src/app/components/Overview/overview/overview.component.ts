import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Sums} from '../../../models/Sums';
import {UserLabeledData} from '../../../models/UserLabeledData';
import {TextAudio} from '../../../models/TextAudio';
import {AudioSnippet} from '../../../models/AudioSnippet';
import {geoJSON, Map, tileLayer} from 'leaflet';
import sui from 'src/assets/sui.json';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  map: Map;
  inputData: Sums = new Sums(0, 0, 0);
  userInputData: Array<UserLabeledData> = [];
  editElement = false;
  textAudio = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  audioSnippet = new AudioSnippet(0, 0);

  ngOnInit() {
    this.map = new Map('mapid', {zoomControl: false}).setView([46.818188, 8.227512], 7);
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(this.map);
    this.onMapReady(this.map);
    geoJSON(sui).addTo(this.map);
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.dragging.disable();
    this.apiService.getLabeledSums().subscribe(l => {
      this.inputData = l;
    });
    this.apiService.getTopFiveUsersLabeledCount().subscribe(l => this.userInputData = l);
  }

  onMapReady(map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  isEditElement(isEdit: boolean): void {
    this.editElement = isEdit;
  }

  setTextAudio(tA: TextAudio): void {
    this.textAudio = tA;
    this.audioSnippet.startTime = tA.audioStart;
    this.audioSnippet.endTime = tA.audioEnd;
  }
}
