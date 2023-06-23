export interface IAlojamiento {
  id: number;
  nombre: string;
  descripcion: string;
  tiempo_estadia: number;
}

export class Alojamiento implements IAlojamiento {
  id: number = -1;
  nombre = '';
  descripcion = '';
  tiempo_estadia = 0;
}
