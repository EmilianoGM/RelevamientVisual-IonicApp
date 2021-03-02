export interface IUsuario {
    id_numerico: number;
    correo: string;
    perfil: string;
    sexo: string;
}
export interface IUsuarioId extends IUsuario {
    id;
}