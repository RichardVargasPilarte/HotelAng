export interface ICliente {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  tipo_identificacion: number;
  num_identificacion: string;
}


export class Cliente implements ICliente {
  id: number = -1;
  nombre = '';
  apellido = '';
  direccion = '';
  telefono = '';
  email = '';
  tipo_identificacion = 0;
  num_identificacion = '';
}

export interface IClientResponse {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  tipo_identificacion: number;
  num_identificacion: string;
}
