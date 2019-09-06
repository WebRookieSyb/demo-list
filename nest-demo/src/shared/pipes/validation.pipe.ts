import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { json } from "body-parser";

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('No data submitted');
        }
        return value;
    }
}