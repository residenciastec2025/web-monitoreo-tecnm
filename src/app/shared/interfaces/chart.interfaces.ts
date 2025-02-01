export interface ChartData{
    studentsTotal: number;
    finalAverageGroup: number;
    units: { reprobados: number; aprobados: number; desertores: number }[];
    final: { reprobados: number; aprobados: number; desertores: number };
    finalPercentages: { aprobados: string; reprobados: string; desertores: string };
    averageRange: {
      range0_9: number;
      range10_19: number;
      range20_29: number;
      range30_39: number;
      range40_49: number;
      range50_59: number;
      range60_69: number;
      range70_79: number;
      range80_89: number;
      range90_100: number;
    };
    

}

export interface AverageRange{
    [key: string]: number;
}