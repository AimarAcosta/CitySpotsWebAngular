import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Spot } from '../../models/spot.model';
import { Country } from '../../models/country.model';
import { Category } from '../../models/category.model';
import * as L from 'leaflet';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-spot-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './spot-detail.html'
})
export class SpotDetail implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  lang = inject(LanguageService);

  spot: Spot | undefined;
  countries: Country[] = [];
  categories: Category[] = [];
  
  private map: L.Map | undefined;

  ngOnInit() {
    this.api.getCountries().subscribe({
      next: (data) => this.countries = data,
      error: (err) => console.error(err)
    });

    this.api.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getSpot(id).subscribe({
        next: (data) => {
          this.spot = data;
          setTimeout(() => this.initMap(), 100);
        },
        error: (err) => console.error(err)
      });
    }
  }

  initMap() {
    if (!this.spot || !this.spot.lat || !this.spot.lng) return;

    this.map = L.map('mapDetail', {
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false
    }).setView([this.spot.lat, this.spot.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    L.marker([this.spot.lat, this.spot.lng]).addTo(this.map);
  }

  getCountryName(id: number): string {
    const country = this.countries.find(c => c.id === id.toString());
    return country ? country.name : '';
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id === id.toString());
    return category ? category.name : '';
  }

  openExternalMap() {
    if (this.spot) {
      const url = `https://www.google.com/maps?q=${this.spot.lat},${this.spot.lng}`;
      window.open(url, '_blank');
    }
  }
}