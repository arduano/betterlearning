import envVars from "./env";

interface ConfigVars{
    JWTSecret: string
}

export const config: ConfigVars = {
    JWTSecret: envVars.JWT_SECRET
}