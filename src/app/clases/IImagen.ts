export interface IImagen {
    usuario: string;
    fecha: string
    tipo: number;
    url: string;
}

export interface IImagenId extends IImagen {
    id;
}

export interface IImagenIdVoto extends IImagenId {
    votado: boolean;
}