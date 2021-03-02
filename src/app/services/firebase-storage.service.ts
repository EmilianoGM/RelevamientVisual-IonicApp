import { Injectable } from '@angular/core';
//Angular fire
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  /**
   * 
   * @param nombreArchivo Nombre del archivo a subir
   * @param datos Archivo a subir
   */
  public tareaCloudStorage(nombreArchivo: string, datos:any){
    return this.storage.upload(nombreArchivo, datos);
  }

  /**
   * Referencia del archivo
   * @param nombreArchivo  Corresponde a la referencia del archivo,
   * que nos permitirá obtener la URL de descarga cuando el proceso de carga del archivo finalice
   */
  public referenciaCloudStorage(nombreArchivo: string){
    return this.storage.ref(nombreArchivo);
  }


}
