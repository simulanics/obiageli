import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import * as tt from '@tomtom-international/web-sdk-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  map: any;
  // initialState = { lng: 3.38681138, lat: 6.45242058, zoom: 14 };
  initialState = { lng: 0, lat: 0, zoom: 14 };

  constructor(private httpClient: HttpClient) {}

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          this.initialState.lng = position.coords.longitude;
          this.initialState.lat = position.coords.latitude;
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  private initLocationMap(): void {
    this.map = tt.map({
      key: environment.tomtom.key,
      container: 'map',
    });

    this.map.addControl(new tt.FullscreenControl());
    this.map.addControl(new tt.NavigationControl());

    this.getCurrentPosition().subscribe((position: any) => {
      this.map.on('load', () => {
        this.map.resize();
        const div = document.createElement('div');
        div.style.width = '120px';
        div.style.height = '60px';
        div.style.background = 'white';
        div.style.color = 'black';
        div.style.textAlign = 'center';
        div.style.padding = '2px';
        div.innerHTML = '<p>You are here</p>';

        let popup = new tt.Popup({
          closeButton: false,
          anchor: 'bottom',
          offset: { top: [0, -70], bottom: [0, -130] },
        }).setDOMContent(div);

        const marker = new tt.Marker()
          .setLngLat({
            lat: position.latitude,
            lng: position.longitude,
          })
          .addTo(this.map);
        marker.setPopup(popup).togglePopup();
      });
      this.map.flyTo({
        center: {
          lat: position.latitude,
          lng: position.longitude,
        },
        zoom: this.initialState.zoom,
      });

      // const popup = new tt.Popup({
      //   // anchor: 'top',
      //   closeButton: false,
      //   offset: { top: [0, -70] },
      // }).setHTML('You are here');

      // const marker = new tt.Marker()
      //   .setLngLat({
      //     lat: position.latitude,
      //     lng: position.longitude,
      //   })
      //   .addTo(this.map);
      // marker.setPopup(popup).togglePopup();
    });
  }

  public ngAfterViewInit(): void {
    this.initLocationMap();
  }

  ngOnInit() {}
}
