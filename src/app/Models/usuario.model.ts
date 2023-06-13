import { Grupos } from "./grupo.model";

export class Usuario {
  id: number | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  password: string | undefined;
  username: string | undefined;
  email: string | undefined;
  direccion: string | undefined;
  estado: number | undefined;
  telefono: string | undefined;
  groups: Grupos[] = [];
}


