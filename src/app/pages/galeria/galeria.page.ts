import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//Clases
import { IImagenId } from '../../clases/IImagen';
//Servicios
import { CloudStorageService } from '../../services/cloud-storage.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {
  hideMensaje: boolean = true;
  hideGrid: boolean = false;

  public listaImagenes: Observable<IImagenId[]>;
  public listaImagenesOrdenada: Observable<any>;

  constructor(
    private cloudStorageService: CloudStorageService,
    public spinnerService: SpinnerService
  ) { 
    this.ordenarporFecha();
  }

  ngOnInit() {
    this.spinnerService.presentLoading(4000);
  }

  /**
   * Trae y ordena la lista de imágenes a mostrar por fecha de manera descendente
   */
  public ordenarporFecha(){
    this.listaImagenes = this.cloudStorageService.traerImagenesConVoto();
    this.listaImagenesOrdenada = this.listaImagenes.pipe(map((data) => {
      data.sort((valor1, valor2) => {
        return (+new Date(valor2.fecha)) - (+new Date(valor1.fecha))
      });
      return data;
      }));
  }

  /**
   * Test visual de voto en una imagen
   */
  public hacerVoto(){
    this.hideMensaje = false;
    this.hideGrid = true;
  }

}
