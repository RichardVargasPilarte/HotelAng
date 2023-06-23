import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";
import { Usuario } from '../models/usuario.model';



export interface IUsuarioResponseDto extends IMainResponseObjectDto<Usuario> {

}

export interface IUsuariosResponseDto extends IMainResponseArrayDto<Usuario> {

}