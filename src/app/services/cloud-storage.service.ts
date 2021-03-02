import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//Clases
import { IUsuario, IUsuarioId } from '../clases/IUsuario';
import { IImagen, IImagenId } from '../clases/IImagen';
//Angular Fire
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  coleccionUsuarios: AngularFirestoreCollection<IUsuario>;
  coleccionImagenes:  AngularFirestoreCollection<IImagen>;
  itemUsuario : Observable<IUsuarioId[]>;
  itemImagen : Observable<IImagenId[]>;
  listaUsuarios: IUsuarioId[];

  constructor(
    private dataBase: AngularFirestore
  ) {
    this.coleccionUsuarios = dataBase.collection<IUsuario>('usuarios');
    this.coleccionImagenes = dataBase.collection<IImagen>('imagenesData');
  }

  /**
   * Treae una lista de usuarios desde la base de datos
   */
  public traerUsuarios() {
    this.itemUsuario = this.coleccionUsuarios.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUsuario;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
    console.log('USUARIOS:', this.itemUsuario);
    this.itemUsuario.forEach( a => {
      this.listaUsuarios = a;
      this.listaUsuarios.forEach(usuario => {
        console.log("Usuario:", usuario.id);
      })
      console.log("Usuarios", this.listaUsuarios);
    });


  }

  /**
   * Trae una lista de los datos de las imagenes tomadas desde la base de datos
   */
  public traerImagenes(): Observable<IImagenId[]> {
    this.itemImagen = this.coleccionImagenes.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IImagen;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
    return this.itemImagen;
  }

  /**
   * Carga los datos de una imagen en la base de datos
   * @param data Datos de la imagen a cargar
   */
  public cargarImagen(data: IImagen) {
    let id = this.dataBase.createId();
    this.coleccionImagenes.doc(id).set(data).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }

  /**
   * Genera un id aleatorio
   */
  public generarId(){
    return this.dataBase.createId();
  }
}
