import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';
import { Spot } from '../../models/spot.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-spot-map',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './spot-map.html',
  styleUrl: './spot-map.css',
})
export class SpotMap implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  lang = inject(LanguageService);

  spots: Spot[] = [];
  private map: L.Map | undefined;

  ngOnInit() {
    this.api.getSpots().subscribe({
      next: (data) => {
        this.spots = data;
        setTimeout(() => this.initGeneralMap(), 100);
      },
      error: (e) => console.error(e),
    });
  }

  initGeneralMap() {
    this.map = L.map('mapGeneral').setView([43.2627, -2.9253], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map,
    );

    const bounds: L.LatLngTuple[] = [];

    this.spots.forEach((spot) => {
      if (spot.lat && spot.lng) {
        const marker = L.marker([spot.lat, spot.lng]).addTo(this.map!);
        bounds.push([spot.lat, spot.lng]);

        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <h6>${spot.name}</h6>
          <p class="small mb-1">${this.lang.get('City')}: ${spot.city}</p>
          <button class="btn btn-primary btn-sm w-100 text-white" style="font-size: 11px;">${this.lang.get('DetailBtn')}</button>
        `;

        popupContent.querySelector('button')?.addEventListener('click', () => {
          this.router.navigate(['/spots', spot.id]);
        });

        marker.bindPopup(popupContent);
      }
    });

    if (bounds.length > 0 && this.map) {
      this.map.fitBounds(bounds);
    }
  }
}
