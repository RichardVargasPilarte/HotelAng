import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";
import { Alojamiento } from '../Models/alojamiento.model';


export interface IAlojamientoResponseDto extends IMainResponseObjectDto<Alojamiento> {

}

export interface IAlojamientosResponseDto extends IMainResponseArrayDto<Alojamiento> {

}
