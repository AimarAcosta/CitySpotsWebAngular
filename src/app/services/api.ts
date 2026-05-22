import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Spot } from '../models/spot.model';
import { Country } from '../models/country.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getSpots(): Observable<Spot[]> {
    return this.http.get<Spot[]>(`${this.baseUrl}/spots`);
  }

  getSpot(id: string): Observable<Spot> {
    return this.http.get<Spot>(`${this.baseUrl}/spots/${id}`);
  }

  createSpot(spot: Spot): Observable<Spot> {
    return this.http.post<Spot>(`${this.baseUrl}/spots`, spot);
  }

  updateSpot(id: string, spot: Spot): Observable<Spot> {
    return this.http.put<Spot>(`${this.baseUrl}/spots/${id}`, spot);
  }

  deleteSpot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/spots/${id}`);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/countries`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }
}
