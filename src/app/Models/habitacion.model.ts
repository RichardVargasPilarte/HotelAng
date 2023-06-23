export interface IHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: string;
  numero_personas: number;
  alojamiento_id: number;
}


export class Habitacion implements IHabitacion {
  id: number = -1;
  nombre = '';
  descripcion = '';
  precio = -1;
  activo = '';
  numero_personas = -1;
  alojamiento_id = -1;
}
