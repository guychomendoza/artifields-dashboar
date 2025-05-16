import {z} from "zod";

export const GetUserCurrentWeatherInfoSchema = z.object({
    base: z.string(),
    clouds: z.object({
        all: z.number()
    }),
    cod: z.number(),
    coord: z.object({
        lon: z.number(),
        lat: z.number()
    }),
    dt: z.number(),
    id: z.number(),
    main: z.object({
        feels_like: z.number(),
        grnd_level: z.number(),
        humidity: z.number(),
        pressure: z.number(),
        sea_level: z.number(),
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),
    }),
    name: z.string(),
    sys: z.object({
        country: z.string(),
        id: z.number().optional(),
        sunrise: z.number(),
        sunset: z.number(),
        type: z.number().optional(),
    }),
    timezone: z.number(),
    visibility: z.number(),
    weather: z.array(
        z.object({
            description: z.string(),
            icon: z.string(),
            id: z.number(),
            main: z.string(),
        })
    ),
    wind: z.object({
        deg: z.number(),
        speed: z.number(),
    })
})

export const GetUserCurrentWeatherInfoForecastSchema = z.object({
    city: z.object({
        coord: z.object({
            lat: z.number(),
            lon: z.number(),
        }),
        country: z.string(),
        id: z.number(),
        name: z.string(),
        population: z.number(),
        sunrise: z.number(),
        sunset: z.number(),
        timezone: z.number()
    }),
    cnt: z.number(),
    cod: z.string(),
    list: z.array(
        z.object({
            clouds: z.object({
                all: z.number(),
            }),
            dt: z.number(),
            dt_txt: z.string(),
            main: z.object({
                feels_like: z.number(),
                grnd_level: z.number(),
                humidity: z.number(),
                pressure: z.number(),
                sea_level: z.number(),
                temp: z.number(),
                temp_max: z.number(),
                temp_min: z.number(),
            }),
            pop: z.number(),
            sys: z.object({
                pod: z.string().optional(),
            }),
            visibility: z.number(),
            weather: z.array(
                z.object({
                    description: z.string(),
                    icon: z.string(),
                    id: z.number(),
                    main: z.string(),
                })
            ),
            wind: z.object({
                deg: z.number(),
                speed: z.number(),
            })
        })
    ),
    message: z.number(),
})