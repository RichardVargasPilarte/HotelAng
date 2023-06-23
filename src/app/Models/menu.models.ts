export interface IMenu {
    id: number;
    nombre: string;
    descripcion: string;
    icon: string;
}

export class Menu implements IMenu {
    id: number = -1;
    nombre = '';
    descripcion = '';
    icon = '';
}