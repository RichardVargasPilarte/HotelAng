/* eslint-disable @typescript-eslint/no-empty-interface */
import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";
import { Usuario } from '../Models/usuario.model';

export interface IUsuarioResponseDto extends IMainResponseObjectDto<Usuario> {

}

export interface IUsuariosResponseDto extends IMainResponseArrayDto<Usuario> {

}
