import { Injectable } from '@angular/core';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private fileService: FileService
  ) { }

  convertBase64ToPhotoUrl(photoBase64: string) {
    if (photoBase64 == null || photoBase64 == '') {
      return '';
    }
    
    const photoExtension = this.fileService.fileExtension(photoBase64);
    return `data:image/${photoExtension};base64,${photoBase64}`;
  }

}
