import { Alojamiento } from "./alojamiento.model";

export interface IHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  numero_personas: number;
  alojamiento_id: number;
}


export class Habitacion implements IHabitacion {
  id = -1;
  nombre = '';
  descripcion = '';
  precio = -1;
  estado = '';
  numero_personas = -1;
  alojamiento_id = -1;
}

export interface IHabitacionResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  numero_personas: number;
  alojamiento_id: Alojamiento;
}

