

export interface IGrupos {
  id: number;
  name: string;
  permissions: number[];
} 

export class Grupos implements IGrupos{
  id = -1;
  name = '';
  permissions= [];
}
