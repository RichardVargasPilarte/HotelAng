interface IResponseDto {
    code: number
    error?: string;
    message?: string;
}

export interface IMainResponseObjectDto<T> extends IResponseDto {
    data: T
}

export interface IMainResponseArrayDto<T> extends IResponseDto {
    data: T[];
}