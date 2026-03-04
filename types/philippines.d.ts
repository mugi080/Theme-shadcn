// types/philippines.d.ts
declare module "philippines" {
  export const provinces: { code: string; name: string }[]
  export const cities: { code: string; name: string; province_code: string }[]
  export const barangays: { code: string; name: string; city_code: string }[]
}