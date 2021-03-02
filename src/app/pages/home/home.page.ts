import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

//Servicios
import { AuthenticateService } from '../../services/authenticate.service';
import { PhotoService } from '../../services/photo.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private photoService: PhotoService,
    public spinnerService: SpinnerService
  ) {
  }

  ngOnInit() {
    this.spinnerService.presentLoading(2000);
  }

  //Muestra la cámara y agrega la foto a la galería
  public agregarFotoAGaleria(){
    this.photoService.agregarAGaleria().finally(() => {
      this.navCtrl.navigateForward('/galeria');
    });
  }

  /**
   * Llama al servicio de Auth para desloggear al usuario y vuelve a la página anterior
   */
  logout() {
    this.authService.logoutUsuario()
      .then(res => {
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }
}
