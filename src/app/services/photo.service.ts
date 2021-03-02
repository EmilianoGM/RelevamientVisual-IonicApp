import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource } from '@capacitor/core';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
//Clases
import { IImagen, IImagenId } from '../clases/IImagen';
//Servicios
import { FirebaseStorageService } from './firebase-storage.service';
import { CloudStorageService } from './cloud-storage.service';
import { AuthenticateService } from './authenticate.service';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  uploadedImageUrl: Observable<string>;
  tipo: number = null;

  constructor(
    private firebaseStorageService: FirebaseStorageService,
    private cloudStorageService: CloudStorageService,
    private authenticateService: AuthenticateService
  ) { }

  /**
   * Despliega la cámara para tomar una foto y agregarla a galeria
   */
  public async agregarAGaleria(){
    const fotoSacada = await Camera.getPhoto({
      height: 480,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 50,
      width: 640
    });

    const fotoGuardada = await this.guardarPhoto(fotoSacada);
    
    return "********PROCESO: " + fotoGuardada + "********" ;
  }

  /**
   * Guarda la foto en la base de datos
   * @param cameraPhoto Foto tomada desde la cámara
   */
  public async guardarPhoto(cameraPhoto: CameraPhoto){
    const response = await fetch(cameraPhoto.webPath!);
    response.blob().then(archivo =>{
      let nombreArchivo = this.cloudStorageService.generarId() + ".png";
      let referencia = this.firebaseStorageService.referenciaCloudStorage(nombreArchivo);
      let tarea = this.firebaseStorageService.tareaCloudStorage(nombreArchivo, archivo);

      tarea.snapshotChanges().pipe(
        finalize(() => {
          this.uploadedImageUrl = referencia.getDownloadURL();
          this.uploadedImageUrl.subscribe(resp =>{
            let urlString: string = resp;

            console.log(urlString);
            console.log("en uploaded subscribe");
            let userUID = this.authenticateService.getUidUsuario();
            console.log("USER UID:", userUID);
            let hoy = new Date();
            let hoyString = hoy.toString();
            let tipoNumero = (this.tipo !== null) ? this.tipo : 1;
            let imagen: IImagen = {
              usuario: userUID,
              fecha: hoyString,
              tipo: tipoNumero,
              url: urlString
            };
            this.cloudStorageService.cargarImagen(imagen);
          });
        })
      ).subscribe();
    });

    return "Completado";
  }

}
