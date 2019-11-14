import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Sums} from '../../../models/Sums';
import {UserLabeledData} from '../../../models/UserLabeledData';
import {TextAudio} from '../../../models/TextAudio';
import {AudioSnippet} from '../../../models/AudioSnippet';

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

  inputData: Sums = new Sums(0, 0, 0);
  userInputData: Array<UserLabeledData> = [];
  editElement = false;
  textAudio = new TextAudio(0, 0, 0, '', 0, '', 0, 0, 0);
  audioSnippet = new AudioSnippet(0, 0);

  ngOnInit() {
    this.apiService.getLabeledSums().subscribe(l => {
      this.inputData = l;
    });
    this.apiService.getTopFiveUsersLabeledCount().subscribe(l => this.userInputData = l);
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
