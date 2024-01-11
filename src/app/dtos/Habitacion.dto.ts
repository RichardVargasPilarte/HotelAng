import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";

import { Habitacion } from '../Models/habitacion.model';

export interface IHabitacionResponseDto extends IMainResponseObjectDto<Habitacion> {

}

export interface IHabitacionesResponseDto extends IMainResponseArrayDto<Habitacion> {

}
