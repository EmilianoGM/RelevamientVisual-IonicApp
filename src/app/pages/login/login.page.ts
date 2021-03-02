import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, MenuController } from '@ionic/angular';
import { AuthenticateService } from '../../services/authenticate.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  //Mensajes de validacion para el formulario
  validation_messages = {
    'email': [
      { type: 'required', message: 'El email es requerido.' },
      { type: 'pattern', message: 'Por favor introduzca un email válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe contener al menos 6 caracteres.' }
    ]
  };
  
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private menuController : MenuController
  ) { }

  ngOnInit() {
    this.cargarFormulario();
  }

  /**
   * Crea el formulario y agrega validación a los dos campos que tiene
   */
  cargarFormulario(){
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
    });
  }
  
  /**
   * Para loggear el usuario de la base de datos
   * @param value recibe los datos del formulario
   */
  loggearUsuario(value) {
    this.authService.loginUsuario(value)
      .then(res => {
        this.errorMessage = "";
        this.navCtrl.navigateForward('/home');
      }, err => {
        this.errorMessage = err.message;
      })
  }

  /**
   * Navega al registro
   */
  irARegistro() {
    this.navCtrl.navigateForward('/register');
  }

  /**
   * Carga el email y clave de un usuario en el sistema
   * @param tipo Numero de selección del tipo de usario (1:admin - 2:invitado - 3:usuario - 4:anonimo - 5:tester)
   */
  public precargarUsuario(tipo: number) {
    try{
      switch (tipo) {
        case 1:
          this.validations_form.controls['email'].setValue('admin@admin.com');
          this.validations_form.controls['password'].setValue('111111');
          break;
        case 2:
          this.validations_form.controls['email'].setValue('invitado@invitado.com');
          this.validations_form.controls['password'].setValue('222222');
          break;
        case 3:
            this.validations_form.controls['email'].setValue('usuario@usuario.com');
            this.validations_form.controls['password'].setValue('333333');
            break;
        case 4:
            this.validations_form.controls['email'].setValue('anonimo@anonimo.com');
            this.validations_form.controls['password'].setValue('444444');
            break;
        case 5:
              this.validations_form.controls['email'].setValue('tester@tester.com');
              this.validations_form.controls['password'].setValue('555555');
              break;
        default:
          console.log("default");
          break;
      }
      this.menuController.close();
    } catch(error){
      console.log('Error en precargar:', error);
    }
    
  }

  /**
   * Despliega un menu en la pantalla del usuario
   */
  public openMenu(){
    this.menuController.enable(true, 'first');
    this.menuController.open('first');
  }

}
