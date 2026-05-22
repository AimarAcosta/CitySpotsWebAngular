import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';
import { Spot } from '../../models/spot.model';
import { Country } from '../../models/country.model';
import { Category } from '../../models/category.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-spot-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './spot-form.html',
  styleUrl: './spot-form.css',
})
export class SpotForm implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  lang = inject(LanguageService);

  spot: Spot = {
    id: '',
    name: '',
    categoryId: 0,
    countryId: 0,
    city: '',
    rating: 1,
    lat: 0,
    lng: 0,
  };
  countries: Country[] = [];
  categories: Category[] = [];
  isEditMode = false;
  showError = false;

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  ngOnInit() {
    this.api.getCountries().subscribe({
      next: (data) => (this.countries = data),
      error: (e) => console.error(e),
    });

    this.api.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (e) => console.error(e),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.api.getSpot(id).subscribe({
        next: (data) => {
          this.spot = data;
          this.initMap();
        },
        error: (e) => console.error(e),
      });
    } else {
      setTimeout(() => this.initMap(), 100);
    }
  }

  initMap() {
    const startLat = this.spot.lat || 43.2627;
    const startLng = this.spot.lng || -2.9253;

    this.map = L.map('mapForm').setView([startLat, startLng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map,
    );

    if (this.spot.lat && this.spot.lng) {
      this.marker = L.marker([this.spot.lat, this.spot.lng]).addTo(this.map);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.spot.lat = parseFloat(e.latlng.lat.toFixed(6));
      this.spot.lng = parseFloat(e.latlng.lng.toFixed(6));

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        if (this.map) {
          this.marker = L.marker(e.latlng).addTo(this.map);
        }
      }
    });
  }

  saveSpot() {
    this.showError = false;

    if (
      !this.spot.name ||
      !this.spot.city ||
      this.spot.countryId <= 0 ||
      this.spot.categoryId <= 0 ||
      this.spot.rating < 1 ||
      this.spot.rating > 5
    ) {
      this.showError = true;
      return;
    }

    if (this.isEditMode) {
      this.api.updateSpot(this.spot.id, this.spot).subscribe({
        next: () => this.router.navigate(['/spots']),
        error: (e) => console.error(e),
      });
    } else {
      this.spot.id = Date.now().toString();
      this.api.createSpot(this.spot).subscribe({
        next: () => this.router.navigate(['/spots']),
        error: (e) => console.error(e),
      });
    }
  }
}
