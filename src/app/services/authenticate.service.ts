import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//Clases
import { IUsuario, IUsuarioId} from '../clases/IUsuario';
//Angular Fire
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  authState: any;
  coleccion: AngularFirestoreCollection<IUsuario>;
  item : Observable<IUsuarioId[]>;

  constructor( 
    private firebaseAuth: AngularFireAuth,
    private dataBase: AngularFirestore
  ) {
    this.firebaseAuth.authState.subscribe( authState => {
      this.authState = authState;
    });
    this.coleccion = dataBase.collection<IUsuario>('usuarios');
  }

  /**
   * Para registrar un usuario en Firebase
   * @param value Recibe datos con un campo email y otro password
   */
  public registrarUsuario(value){
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            let usuario: IUsuario = {
              id_numerico: 5,
              correo: value.email,
              perfil: 'tester',
              sexo: 'femenino'
            };
            this.coleccion.doc(res.user.uid).set(usuario);
            resolve(res);
          },
          err => reject(err))
    });
  }
  
  /**
   * Para loggear un usuario de Firebase
   * @param value Recibe datos con un campo email y otro password
   */
  public loginUsuario(value) {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    });
  }

  /**
   * Desloggea al usuario
   */
  public logoutUsuario() {
    return new Promise<void>((resolve, reject) => {
      if (this.firebaseAuth.currentUser) {
        this.firebaseAuth.signOut()
          .then(() => {
            console.log("LOG Out");
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  /**
   * Detalla al usuario registrado
   */
  public detallarUsuario() {
    return this.firebaseAuth.user;
  }

  /**
   * Devuelve el UID del usuario registrado
   */
  public getUidUsuario(){
    return this.authState.uid;
  }
}
