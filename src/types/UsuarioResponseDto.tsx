// src/types/UsuarioResponseDto.ts
export interface UsuarioResponseDto {
    id: number;
    nombre: string;
    email: string;
    direccion: string;
    roles: string[];
  }
  
  // src/types/AutenticacionResponseDto.ts
  export interface AutenticacionResponseDto {
    userId: number;
  }
  