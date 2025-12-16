import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Loader {
  #http = inject(HttpClient)

  static API_URL = "/"

  get(URL: string) {
    return this.#http.get(`${Loader.API_URL}${URL}`);
  }
}
