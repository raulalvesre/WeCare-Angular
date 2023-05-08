import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  urlToFile(url: string, filename: string, mimeType: string) {
    return (fetch(url)
      .then((response) => response.blob())
      .then((blob) => new File([blob], filename, { type: mimeType }))
    );
  }
}
