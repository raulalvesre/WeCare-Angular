import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  urlToFile(url: string, filename: string = '') {
    return (fetch(url)
      .then((response) => response.blob())
      .then((blob) => new File([blob], filename, { type: blob.type }))
    );
  }

  fileExtension(base64Content: string) {
    let extension = '';
    switch (base64Content.charAt(0)) {
      case '/':
        extension = 'jpg';
        break;
      case 'i':
        extension = 'png';
        break;
      default:
        break;
    }

    return extension;
  }
}
