import { Grupos, IGrupos } from "./grupo.model";


export interface IUsuario {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  password: string | null;
  username: string | null;
  email: string | null;
  direccion: string | null;
  estado: number | null;
  telefono: string | null;
  groups: IGrupos[]
}


export class Usuario implements IUsuario {
  id = -1;
  first_name = ''
  last_name = ''
  password = ''
  username = ''
  email = ''
  direccion = ''
  estado = -1;
  telefono = ''
  groups: IGrupos[] = []
}


