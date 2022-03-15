import { Type } from "class-transformer";
import { IsBoolean } from "class-validator";

export class CreateGroupDto {
    name: string;

    @IsBoolean()
    private: boolean;
}
