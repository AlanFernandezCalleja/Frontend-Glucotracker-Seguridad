import { Injectable } from '@angular/core';

export type Momento = "ayunas" | "despues" | "dormir";
export type GrupoEdad = "infante" | "adolescente" | "joven" | "adulto" | "mayor";
export type TipoPaciente = "Normal" | "Diabetes Tipo 1"| "Diabetes Tipo 2" | "Embarazada" | "Diabetes Gestacional";
export type Estado = "HIPOGLUCEMIA" | "NORMAL" | "HIPERGLUCEMIA" | "PARAM_INVALIDO";

export interface RangoGlucosa {
  min: number;
  max: number;
}

type RangosPorMomento = Record<Momento, RangoGlucosa>;

@Injectable({
  providedIn: 'root'
})
export class GlucosaService {

  private readonly RANGOS_NORMALES: Record<GrupoEdad, RangosPorMomento> = {
    infante: { ayunas: { min: 90, max: 180 }, despues: { min: 90, max: 200 }, dormir: { min: 100, max: 180 } },
    adolescente: { ayunas: { min: 90, max: 130 }, despues: { min: 90, max: 180 }, dormir: { min: 90, max: 150 } },
    joven: { ayunas: { min: 90, max: 130 }, despues: { min: 90, max: 140 }, dormir: { min: 90, max: 150 } },
    adulto: { ayunas: { min: 90, max: 100 }, despues: { min: 90, max: 150 }, dormir: { min: 100, max: 140 } },
    mayor: { ayunas: { min: 80, max: 110 }, despues: { min: 80, max: 160 }, dormir: { min: 100, max: 140 } },
  };

  private readonly RANGOS_DIABETICOS: Record<GrupoEdad, RangosPorMomento> = {
    infante: { ayunas: { min: 90, max: 130 }, despues: { min: 90, max: 180 }, dormir: { min: 90, max: 150 } },
    adolescente: { ayunas: { min: 90, max: 130 }, despues: { min: 90, max: 180 }, dormir: { min: 90, max: 150 } },
    joven: { ayunas: { min: 80, max: 130 }, despues: { min: 80, max: 180 }, dormir: { min: 90, max: 150 } },
    adulto: { ayunas: { min: 80, max: 130 }, despues: { min: 80, max: 180 }, dormir: { min: 90, max: 150 } },
    mayor: { ayunas: { min: 80, max: 110 }, despues: { min: 80, max: 160 }, dormir: { min: 100, max: 180 } },
  };

  private readonly RANGOS_EMBARAZADAS: Record<Momento, RangoGlucosa> = {
    ayunas: { min: 70, max: 95 },
    despues: { min: 109, max: 129 },
    dormir: { min: 100, max: 120 },
  };

  private readonly RANGOS_EMBARAZADAS_DG: Record<Momento, RangoGlucosa> = {
    ayunas: { min: 40, max: 95 },
    despues: { min: 40, max: 140 },
    dormir: { min: 40, max: 120 },
  };

  // ------------------ LÓGICA BASE ------------------

  private getGrupoEdad(edad: number): GrupoEdad | null {
    if (edad >= 6 && edad <= 12) return "infante";
    if (edad >= 13 && edad <= 19) return "adolescente";
    if (edad >= 20 && edad <= 35) return "joven";
    if (edad >= 36 && edad <= 60) return "adulto";
    if (edad > 60) return "mayor";
    return null;
  }

  private obtenerRango(
    edad: number,
    tipo: TipoPaciente,
    momento: Momento
  ): RangoGlucosa | undefined {
    if (tipo === "Embarazada") {
      return this.RANGOS_EMBARAZADAS[momento];
    } else if (tipo === "Diabetes Gestacional") {
      return this.RANGOS_EMBARAZADAS_DG[momento];
    } else {
      const grupo = this.getGrupoEdad(edad);
      if (!grupo) return undefined;

      if (tipo === null) {
        return this.RANGOS_NORMALES[grupo][momento];
      } else if (tipo === "Diabetes Tipo 1" || tipo === "Diabetes Tipo 2"  ) {
        return this.RANGOS_DIABETICOS[grupo][momento];
      }
    }
    return undefined;
  }

  private esHipoglucemia(valor: number): boolean {
    return valor < 70;
  }

  private esHiperglucemia(
    edad: number,
    tipo: TipoPaciente,
    momento: Momento,
    valor: number
  ): boolean {
    const rango = this.obtenerRango(edad, tipo, momento);
    return rango ? valor > rango.max : false;
  }

  // ------------------ FUNCIÓN PRINCIPAL ------------------

  evaluarGlucosa(
    edad: number,
    tipo: TipoPaciente,
    momento: Momento,
    valor: number
  ): Estado {
    if (this.esHipoglucemia(valor)) {
      return "HIPOGLUCEMIA";
    }

    if (this.esHiperglucemia(edad, tipo, momento, valor)) {
      return "HIPERGLUCEMIA";
    }

    const rango = this.obtenerRango(edad, tipo, momento);
    if (!rango) {
      return "PARAM_INVALIDO";
    }

    return "NORMAL";
  }
}
