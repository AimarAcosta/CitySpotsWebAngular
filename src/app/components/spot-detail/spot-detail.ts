import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';
import { Spot } from '../../models/spot.model';
import { Country } from '../../models/country.model';
import { Category } from '../../models/category.model';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-spot-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './spot-detail.html',
  styleUrl: './spot-detail.css',
})
export class SpotDetail implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  lang = inject(LanguageService);

  spot: Spot | undefined;
  countries: Country[] = [];
  categories: Category[] = [];

  private map: L.Map | undefined;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      forkJoin({
        countries: this.api.getCountries(),
        categories: this.api.getCategories(),
        spot: this.api.getSpot(id),
      }).subscribe({
        next: (res) => {
          this.countries = res.countries;
          this.categories = res.categories;
          this.spot = res.spot;

          this.cdr.detectChanges();
          setTimeout(() => this.initMap(), 50);
        },
        error: (e) => console.error(e),
      });
    }
  }

  initMap() {
    if (!this.spot || !this.spot.lat || !this.spot.lng) return;

    this.map = L.map('mapDetail', {
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    }).setView([this.spot.lat, this.spot.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map,
    );
    L.marker([this.spot.lat, this.spot.lng]).addTo(this.map);
  }

  getCountryName(id: number): string {
    const c = this.countries.find((x) => x.id === id.toString());
    return c ? c.name : '';
  }

  getCategoryName(id: number): string {
    const c = this.categories.find((x) => x.id === id.toString());
    return c ? c.name : '';
  }

  openExternalMap() {
    if (this.spot) {
      const url =
        'https://www.google.com/maps?q=' + this.spot.lat + ',' + this.spot.lng;
      window.open(url, '_blank');
    }
  }
}
