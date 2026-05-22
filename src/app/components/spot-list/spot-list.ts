import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api';
import { Spot } from '../../models/spot.model';
import { Country } from '../../models/country.model';
import { Category } from '../../models/category.model';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-spot-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './spot-list.html'
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
      spots: this.api.getSpots()
    }).subscribe({
      next: (result) => {
        this.countries = result.countries;
        this.categories = result.categories;
        this.spots = result.spots;

        this.applyFilters();
        
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error en carga inicial:', err)
    });
  }

  applyFilters() {
    this.filteredSpots = this.spots.filter(s => {
      const matchName = !this.searchTerm || s.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCountry = !this.selectedCountry || s.countryId.toString() === this.selectedCountry;
      const matchCategory = !this.selectedCategory || s.categoryId.toString() === this.selectedCategory;
      return matchName && matchCountry && matchCategory;
    });
  }

  getCountryName(id: number): string {
    const country = this.countries.find(c => c.id === id.toString());
    return country ? country.name : '';
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id === id.toString());
    return category ? category.name : '';
  }

  deleteSpot(id: string) {
    if (confirm(this.lang.get('DeleteConfirm'))) {
      this.api.deleteSpot(id).subscribe({
        next: () => {
          this.api.getSpots().subscribe(data => {
            this.spots = data;
            this.applyFilters();
            this.cdr.detectChanges();
          });
        },
        error: (err) => console.error(err)
      });
    }
  }
}