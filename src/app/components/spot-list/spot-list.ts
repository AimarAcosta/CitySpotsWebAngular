import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';
import { Spot } from '../../models/spot.model';
import { Country } from '../../models/country.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-spot-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './spot-list.html',
})
export class SpotList implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  lang = inject(LanguageService);

  spots: Spot[] = [];
  filteredSpots: Spot[] = [];
  countries: Country[] = [];
  categories: Category[] = [];

  searchTerm: string = '';
  selectedCountry: string = '';
  selectedCategory: string = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      countries: this.api.getCountries(),
      categories: this.api.getCategories(),
      spots: this.api.getSpots(),
    }).subscribe({
      next: (res) => {
        this.countries = res.countries;
        this.categories = res.categories;
        this.spots = res.spots;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

  applyFilters() {
    this.filteredSpots = this.spots.filter((s) => {
      const matchName =
        !this.searchTerm ||
        s.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCountry =
        !this.selectedCountry ||
        s.countryId.toString() === this.selectedCountry;
      const matchCategory =
        !this.selectedCategory ||
        s.categoryId.toString() === this.selectedCategory;
      return matchName && matchCountry && matchCategory;
    });
  }

  getCountryName(id: number): string {
    const c = this.countries.find((x) => x.id === id.toString());
    return c ? c.name : '';
  }

  getCategoryName(id: number): string {
    const c = this.categories.find((x) => x.id === id.toString());
    return c ? c.name : '';
  }

  deleteSpot(id: string) {
    if (confirm(this.lang.get('DeleteConfirm'))) {
      this.api.deleteSpot(id).subscribe({
        next: () => {
          this.api.getSpots().subscribe((data) => {
            this.spots = data;
            this.applyFilters();
            this.cdr.detectChanges();
          });
        },
        error: (e) => console.error(e),
      });
    }
  }
}
