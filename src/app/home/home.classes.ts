export class SpecificCountryData {
    country?: string;
    cases?: object;
    deaths?: object;
    recovered?: object;
}

export class AllCountryData {
    countryInfo?: {
        iso2?: string,
        iso3?: string,
        _id?: number,
        lat?: number,
        long?: number,
        flag?: string
    };
    country: string;
    cases: number;
    todayCases: number;
    deaths: number;
    todayDeaths: number;
    recovered: number;
    active: number;
    critical: number;
    casesPerOneMillion: number;

    recoveredPercentage?: string;
    deathsPercentage?: string;
}

export class WorldData {
    cases?: number;
    recovered?: number;
    deaths?: number;
    recoveredPercentage?: string;
    deathsPercentage?: string;
}