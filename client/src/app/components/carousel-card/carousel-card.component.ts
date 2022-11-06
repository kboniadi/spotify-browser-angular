import { Component, OnInit, Input } from '@angular/core';
import { ResourceData } from '../../data/resource-data';

@Component({
  selector: 'app-carousel-card',
  templateUrl: './carousel-card.component.html',
  styleUrls: ['./carousel-card.component.css']
})
export class CarouselCardComponent implements OnInit {
  category: string;
  name: string;
  imageURL: string;
  url: string;
  id: string;

  @Input() resource:ResourceData;

  constructor() { }

  ngOnInit() {
    this.category = this.resource.category;
    this.name = this.resource.name;
    this.imageURL = this.resource.imageURL;
    this.url = this.resource.url;
    this.id = this.resource.id;
  }

}
