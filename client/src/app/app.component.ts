import { Component } from '@angular/core';
import { PredictionEvent } from './prediction-event';
import { HandTrackerService } from './services/hand-tracker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gesture: string = ""
  constructor(private trackingService: HandTrackerService) {}

  prediction(event: PredictionEvent){
    this.gesture = event.getPrediction();
    this.trackingService.setMessage(this.gesture)
  }
}
