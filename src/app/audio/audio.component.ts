import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AudioRecordingService } from '../services/audio-recording.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AudioComponent implements OnDestroy, OnInit {
  @Output() getAudio = new EventEmitter<any>();
  @Input() isDisabled:any;
  baseURL: string = environment.baseURL;
  displayControls = true;
  isAudioRecording = false;
  audioRecordedTime: any;
  audioBlobUrl: any;
  audioBlob: any;
  audioName: any;
  audioStream: any;
  audioConf = { audio: true }

  constructor(
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time: any) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data: { blob: any; title: any; }) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
  }

  ngOnInit() {
  }


  startAudioRecording() {
    this.clearAudioRecordedData();
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
      setTimeout(() => {
        this.getAudio.emit(this.audioBlob);
      }, 1000)
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  downloadAudioRecordedData() {
    let url = `${this.baseURL}/User/VoiceEnroll?userId=1234`
    this.http.post(url, this.audioBlob).subscribe(res => {
      console.log(res);
    });
    //this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

}
