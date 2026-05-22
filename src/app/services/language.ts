import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<string>(localStorage.getItem('lang') || 'es');

  setLanguage(lang: string) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  get(key: string): string {
    const es: any = {
      'AppTitle': 'City Spots Web',
      'SearchPlaceholder': 'Buscar por nombre...',
      'AllCountries': 'Todos (Países)',
      'AllCategories': 'Todas (Categorías)',
      'CreateBtn': 'Crear Spot',
      'MapBtn': 'Mapa',
      'NoSpots': 'No hay spots para mostrar.',
      'Name': 'Nombre',
      'City': 'Ciudad',
      'Country': 'País',
      'Category': 'Categoría',
      'Rating': 'Valoración',
      'Actions': 'Acciones',
      'Edit': 'Editar',
      'Delete': 'Eliminar',
      'DeleteConfirm': '¿Estás seguro de que deseas eliminar este spot?',
      'FormTitleCreate': 'Crear Spot',
      'FormTitleEdit': 'Editar Spot',
      'ErrorForm': 'Todos los campos obligatorios deben rellenarse correctamente.',
      'SelectCountry': 'Selecciona un país...',
      'SelectCategory': 'Selecciona una categoría...',
      'Lat': 'Latitud (Lat)',
      'Lng': 'Longitud (Lng)',
      'Cancel': 'Cancelar',
      'Save': 'Guardar',
      'MapInstruction': 'Haz clic en el mapa para obtener coordenadas:',
      'DetailTitle': 'Detalles del Spot',
      'LoadingDetail': 'Cargando datos del destino...',
      'OpenExternalMap': 'Abrir en Google Maps',
      'BackList': 'Volver a la Lista',
      'MapTitle': 'Mapa de Marcadores',
      'MapListTitle': 'Lista de Puntos de Interés:',
      'DetailBtn': 'Ver Ficha'
    };

    const eu: any = {
      'AppTitle': 'City Spots Web',
      'SearchPlaceholder': 'Izenaren arabera bilatu...',
      'AllCountries': 'Guztiak (Herrialdeak)',
      'AllCategories': 'Guztiak (Kategoriak)',
      'CreateBtn': 'Spot Sortu',
      'MapBtn': 'Mapa',
      'NoSpots': 'Ez dago spotik erakusteko.',
      'Name': 'Izena',
      'City': 'Hiria',
      'Country': 'Herrialdea',
      'Category': 'Kategoria',
      'Rating': 'Rating',
      'Actions': 'Ekintzak',
      'Edit': 'Editatu',
      'Delete': 'Ezabatu',
      'DeleteConfirm': 'Ziur zaude ezabatu nahi duzula?',
      'FormTitleCreate': 'Spot Sortu',
      'FormTitleEdit': 'Spot Editatu',
      'ErrorForm': 'Nahitaezko eremu guztiak ondo bete behar dira.',
      'SelectCountry': 'Aukeratu herrialdea...',
      'SelectCategory': 'Aukeratu kategoria...',
      'Lat': 'Latitudea (Lat)',
      'Lng': 'Longitudea (Lng)',
      'Cancel': 'Utzi',
      'Save': 'Gorde',
      'MapInstruction': 'Egin klik mapan koordenatuak lortzeko:',
      'DetailTitle': 'Spotaren Xehetasunak',
      'LoadingDetail': 'Helmuga datuak kargatzen...',
      'OpenExternalMap': 'Google Maps-en Ireki',
      'BackList': 'Zerrendara Itzuli',
      'MapTitle': 'Markatzaileen Mapa',
      'MapListTitle': 'Interesguneen Zerrenda:',
      'DetailBtn': 'Fitxa Ikusi'
    };

    if (this.currentLang() === 'eu') {
      return eu[key] || key;
    }
    return es[key] || key;
  }
}